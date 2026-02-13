import { useEffect, useMemo, useState } from "react";

type ViewName = "relatorio" | "novo" | "agenda";
type StatusFiltro = "todos" | "pendentes" | "concluidos";

type Agendamento = {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  descricao: string;
  clienteNome: string;
  clienteTelefone: string;
  clienteEmail: string;
  categoria: string;
  concluido: boolean;
  dataCriacao: string;
};

type AuthState =
  | { status: "loading" }
  | { status: "logged_out" }
  | { status: "logged_in"; user: string };

const TOKEN_KEY = "agenda.jwt";

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDate(isoDate: string): string {
  if (!isoDate) return "-";
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(path, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: "Erro inesperado" }));
    throw new Error(body.message || "Erro na API");
  }
  return response.json();
}

export default function App() {
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });
  const [view, setView] = useState<ViewName>("relatorio");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusFiltro>("todos");

  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginFeedback, setLoginFeedback] = useState("");

  const [calAno, setCalAno] = useState(new Date().getFullYear());
  const [calMes, setCalMes] = useState(new Date().getMonth());

  const [form, setForm] = useState({
    titulo: "",
    data: "",
    hora: "",
    descricao: "",
    clienteNome: "",
    clienteTelefone: "",
    clienteEmail: "",
    categoria: "",
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("agendamentos.theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("agendamentos.theme", theme);
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setAuth({ status: "logged_out" });
      return;
    }

    api<{ user: string }>("/api/auth/me")
      .then((res) => {
        setAuth({ status: "logged_in", user: res.user });
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setAuth({ status: "logged_out" });
      });
  }, []);

  useEffect(() => {
    if (auth.status !== "logged_in") return;
    api<{ agendamentos: Agendamento[] }>("/api/agendamentos")
      .then((res) => setAgendamentos(res.agendamentos))
      .catch((err) => setFeedback(err.message));
  }, [auth]);

  const filtrados = useMemo(() => {
    const texto = filtroTexto.trim().toLowerCase();
    return agendamentos
      .filter((ag) => {
        const searchable = [
          ag.titulo,
          ag.descricao,
          ag.clienteNome,
          ag.clienteTelefone,
          ag.clienteEmail,
          ag.categoria,
        ]
          .join(" ")
          .toLowerCase();
        const matchTexto = !texto || searchable.includes(texto);
        const matchData = !filtroData || ag.data === filtroData;
        const matchStatus =
          filtroStatus === "todos" ||
          (filtroStatus === "pendentes" && !ag.concluido) ||
          (filtroStatus === "concluidos" && ag.concluido);
        return matchTexto && matchData && matchStatus;
      })
      .sort((a, b) => `${a.data}T${a.hora}`.localeCompare(`${b.data}T${b.hora}`));
  }, [agendamentos, filtroTexto, filtroData, filtroStatus]);

  const stats = useMemo(() => {
    const total = agendamentos.length;
    const concluidos = agendamentos.filter((ag) => ag.concluido).length;
    const pendentes = total - concluidos;
    const hoje = toIsoDate(new Date());
    const hojeQtd = agendamentos.filter((ag) => ag.data === hoje).length;
    return { total, concluidos, pendentes, hojeQtd };
  }, [agendamentos]);

  const calendarMap = useMemo(() => {
    const map = new Map<string, Agendamento[]>();
    agendamentos.forEach((ag) => {
      const [y, m] = ag.data.split("-").map(Number);
      if (y === calAno && m === calMes + 1) {
        if (!map.has(ag.data)) map.set(ag.data, []);
        map.get(ag.data)!.push(ag);
      }
    });
    for (const items of map.values()) items.sort((a, b) => a.hora.localeCompare(b.hora));
    return map;
  }, [agendamentos, calAno, calMes]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginFeedback("");
    try {
      const res = await api<{ token: string; user: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });
      localStorage.setItem(TOKEN_KEY, res.token);
      setAuth({ status: "logged_in", user: res.user });
      setLoginPass("");
    } catch (err) {
      setLoginFeedback(err instanceof Error ? err.message : "Falha no login");
    }
  }

  async function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setAuth({ status: "logged_out" });
  }

  async function reloadAgendamentos() {
    const res = await api<{ agendamentos: Agendamento[] }>("/api/agendamentos");
    setAgendamentos(res.agendamentos);
  }

  async function onSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    setFeedback("");

    const required = [
      form.titulo,
      form.data,
      form.hora,
      form.clienteNome,
      form.clienteTelefone,
      form.clienteEmail,
      form.categoria,
    ];
    if (required.some((v) => !v.trim())) {
      setFeedback("Preencha todos os campos obrigatorios.");
      return;
    }

    try {
      if (modoEdicao && idEmEdicao) {
        await api(`/api/agendamentos/${idEmEdicao}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        setFeedback("Agendamento atualizado com sucesso.");
      } else {
        await api("/api/agendamentos", { method: "POST", body: JSON.stringify(form) });
        setFeedback("Agendamento criado com sucesso.");
      }
      await reloadAgendamentos();
      setModoEdicao(false);
      setIdEmEdicao(null);
      setForm({
        titulo: "",
        data: "",
        hora: "",
        descricao: "",
        clienteNome: "",
        clienteTelefone: "",
        clienteEmail: "",
        categoria: "",
      });
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Falha ao salvar");
    }
  }

  function editar(ag: Agendamento) {
    setModoEdicao(true);
    setIdEmEdicao(ag.id);
    setView("novo");
    setForm({
      titulo: ag.titulo,
      data: ag.data,
      hora: ag.hora,
      descricao: ag.descricao,
      clienteNome: ag.clienteNome,
      clienteTelefone: ag.clienteTelefone,
      clienteEmail: ag.clienteEmail,
      categoria: ag.categoria,
    });
  }

  async function toggleStatus(ag: Agendamento) {
    await api(`/api/agendamentos/${ag.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...ag, concluido: !ag.concluido }),
    });
    await reloadAgendamentos();
  }

  async function excluir(ag: Agendamento) {
    if (!window.confirm(`Deseja excluir o agendamento de ${ag.clienteNome}?`)) return;
    await api(`/api/agendamentos/${ag.id}`, { method: "DELETE" });
    await reloadAgendamentos();
  }

  if (auth.status === "loading") {
    return <div className="login-shell">Carregando...</div>;
  }

  if (auth.status === "logged_out") {
    return (
      <section className="login-shell" aria-label="Tela de login">
        <div className="login-card">
          <h1>AgendaPro Consultorio</h1>
          <p className="login-subtitle">Acesso restrito para equipe autorizada.</p>
          <form className="login-form" onSubmit={handleLogin}>
            <label>
              Usuario
              <input value={loginUser} onChange={(e) => setLoginUser(e.target.value)} required />
            </label>
            <label>
              Senha
              <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} required />
            </label>
            <p className="feedback">{loginFeedback}</p>
            <button className="btn btn-primary" type="submit">Entrar</button>
          </form>
        </div>
      </section>
    );
  }

  const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(calAno, calMes, 1));
  const firstWeekday = new Date(calAno, calMes, 1).getDay();
  const daysInMonth = new Date(calAno, calMes + 1, 0).getDate();
  const todayIso = toIsoDate(new Date());

  const calendarCells: React.ReactNode[] = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((d) => (
    <div key={`w-${d}`} className="calendar-weekday">{d}</div>
  ));

  for (let i = 0; i < firstWeekday; i += 1) {
    calendarCells.push(<div key={`empty-start-${i}`} className="calendar-day muted" />);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateIso = `${calAno}-${String(calMes + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const items = calendarMap.get(dateIso) || [];
    const classes = ["calendar-day"];
    if (dateIso === todayIso) classes.push("is-today");
    if (filtroData === dateIso) classes.push("is-selected");

    calendarCells.push(
      <button key={dateIso} type="button" className={classes.join(" ")} onClick={() => setFiltroData(dateIso)}>
        <span className="day-number">{day}</span>
        <span className="day-times">
          {items.slice(0, 2).map((ag) => (
            <span key={ag.id} className="day-time">{ag.hora} {ag.clienteNome}</span>
          ))}
          {items.length > 2 && <span className="day-time">+{items.length - 2} mais</span>}
        </span>
      </button>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <p className="eyebrow">Consultorio</p>
          <h1>AgendaPro</h1>
        </div>

        <nav className="menu">
          <button className={`menu-item ${view === "relatorio" ? "is-active" : ""}`} onClick={() => setView("relatorio")}>Relatorio</button>
          <button className={`menu-item ${view === "novo" ? "is-active" : ""}`} onClick={() => setView("novo")}>Novo Agendamento</button>
          <button className={`menu-item ${view === "agenda" ? "is-active" : ""}`} onClick={() => setView("agenda")}>Agenda</button>
        </nav>

        <button className="btn btn-secondary" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}>
          {theme === "dark" ? "Tema claro" : "Tema escuro"}
        </button>
        <button className="btn btn-secondary" onClick={logout}>Sair</button>
      </aside>

      <main className="workspace">
        {view === "relatorio" && (
          <section className="view is-visible">
            <header className="view-header">
              <h2>Resumo geral</h2>
              <p>Painel inicial com status dos agendamentos.</p>
            </header>
            <section className="stats-grid">
              <article className="stat-card"><p>Total</p><strong>{stats.total}</strong></article>
              <article className="stat-card"><p>Pendentes</p><strong>{stats.pendentes}</strong></article>
              <article className="stat-card"><p>Concluidos</p><strong>{stats.concluidos}</strong></article>
              <article className="stat-card"><p>Hoje</p><strong>{stats.hojeQtd}</strong></article>
            </section>
          </section>
        )}

        {view === "novo" && (
          <section className="view is-visible">
            <section className="panel">
              <header className="panel-header">
                <h2>{modoEdicao ? "Editar agendamento de consulta" : "Novo agendamento de consulta"}</h2>
                <p>Preencha os dados da consulta e do cliente.</p>
              </header>

              <form onSubmit={onSubmitForm}>
                <div className="form-grid">
                  <label>Titulo da consulta *<input value={form.titulo} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} /></label>
                  <label>Data *<input type="date" value={form.data} onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))} /></label>
                  <label>Hora *<input type="time" value={form.hora} onChange={(e) => setForm((f) => ({ ...f, hora: e.target.value }))} /></label>
                  <label className="full">Descricao<textarea rows={3} value={form.descricao} onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} /></label>
                  <label>Nome do cliente *<input value={form.clienteNome} onChange={(e) => setForm((f) => ({ ...f, clienteNome: e.target.value }))} /></label>
                  <label>Telefone do cliente *<input value={form.clienteTelefone} onChange={(e) => setForm((f) => ({ ...f, clienteTelefone: e.target.value }))} /></label>
                  <label>Email do cliente *<input type="email" value={form.clienteEmail} onChange={(e) => setForm((f) => ({ ...f, clienteEmail: e.target.value }))} /></label>
                  <label>Categoria *
                    <select value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}>
                      <option value="">Selecione</option>
                      <option value="Primeira consulta">Primeira consulta</option>
                      <option value="Retorno">Retorno</option>
                      <option value="Exame">Exame</option>
                      <option value="Procedimento">Procedimento</option>
                    </select>
                  </label>
                </div>
                <p className="feedback">{feedback}</p>
                <div className="form-actions">
                  <button className="btn btn-primary" type="submit">{modoEdicao ? "Salvar alteracoes" : "Salvar agendamento"}</button>
                  {modoEdicao && (
                    <button className="btn btn-secondary" type="button" onClick={() => {
                      setModoEdicao(false);
                      setIdEmEdicao(null);
                      setFeedback("");
                      setForm({ titulo: "", data: "", hora: "", descricao: "", clienteNome: "", clienteTelefone: "", clienteEmail: "", categoria: "" });
                    }}>Cancelar edicao</button>
                  )}
                </div>
              </form>
            </section>
          </section>
        )}

        {view === "agenda" && (
          <section className="view is-visible">
            <div className="agenda-grid">
              <section className="panel calendar-panel">
                <header className="calendar-head">
                  <h2>Calendario</h2>
                  <div className="calendar-controls">
                    <button className="btn btn-secondary" onClick={() => {
                      const d = new Date(calAno, calMes - 1, 1);
                      setCalAno(d.getFullYear());
                      setCalMes(d.getMonth());
                    }}>Anterior</button>
                    <strong>{monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}</strong>
                    <button className="btn btn-secondary" onClick={() => {
                      const d = new Date(calAno, calMes + 1, 1);
                      setCalAno(d.getFullYear());
                      setCalMes(d.getMonth());
                    }}>Proximo</button>
                  </div>
                </header>
                <div className="calendar-grid">{calendarCells}</div>
              </section>

              <section className="panel agenda-panel">
                <header className="panel-header">
                  <h2>Agenda</h2>
                  <p>Busque e filtre seus compromissos.</p>
                </header>
                <div className="filter-grid">
                  <label>Buscar<input value={filtroTexto} onChange={(e) => setFiltroTexto(e.target.value)} /></label>
                  <label>Data<input type="date" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} /></label>
                  <label>Status
                    <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value as StatusFiltro)}>
                      <option value="todos">Todos</option>
                      <option value="pendentes">Pendentes</option>
                      <option value="concluidos">Concluidos</option>
                    </select>
                  </label>
                  <button className="btn btn-secondary filter-reset" onClick={() => {
                    setFiltroTexto("");
                    setFiltroData("");
                    setFiltroStatus("todos");
                  }}>Limpar filtros</button>
                </div>

                <div className="list">
                  {filtrados.length === 0 && (
                    <div className="empty-state">
                      <p>Nenhum agendamento encontrado com os filtros atuais.</p>
                      <p>Ajuste os filtros ou cadastre um novo atendimento.</p>
                    </div>
                  )}
                  {filtrados.map((ag) => (
                    <article key={ag.id} className={`agendamento-item ${ag.concluido ? "is-concluido" : ""}`}>
                      <div className="agendamento-top">
                        <div>
                          <h3 className="agendamento-titulo">{ag.titulo}</h3>
                          <p className="agendamento-meta">{formatDate(ag.data)} as {ag.hora}</p>
                        </div>
                        <span className="badge">{ag.concluido ? "Concluido" : "Pendente"}</span>
                      </div>
                      <div className="agendamento-cliente">
                        <span className="cliente-nome">{ag.clienteNome}</span>
                        <span className="cliente-contato">{ag.clienteTelefone} | {ag.clienteEmail}</span>
                        <span className="categoria-tag">{ag.categoria}</span>
                      </div>
                      {ag.descricao && <p className="agendamento-desc">{ag.descricao}</p>}
                      <div className="agendamento-actions">
                        <button className="btn btn-secondary" onClick={() => void toggleStatus(ag)}>{ag.concluido ? "Reabrir" : "Concluir"}</button>
                        <button className="btn btn-secondary" onClick={() => editar(ag)}>Editar</button>
                        <button className="btn btn-secondary" onClick={() => void excluir(ag)}>Excluir</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
