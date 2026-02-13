import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { api } from "../../app/api";
import type {
  Agendamento,
  AgendamentoFormState,
  ModoPaciente,
  NovoPacienteFormState,
  StatusFiltro,
  UseAgendaParams,
  UseAgendaResult,
} from "../../app/types";
import { patientName, patientEmail, patientPhone, toIsoDate } from "../../app/utils";

export function useAgenda({ enabled, onLoadError, onAfterMutation }: UseAgendaParams): UseAgendaResult {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusFiltro>("todos");

  const [modoPacienteForm, setModoPacienteForm] = useState<ModoPaciente>("existente");
  const [pacienteIdForm, setPacienteIdForm] = useState("");
  const [novoPacienteForm, setNovoPacienteForm] = useState<NovoPacienteFormState>({ nome: "", telefone: "", email: "", cpf: "" });
  const [form, setForm] = useState<AgendamentoFormState>({ titulo: "", data: "", hora: "", descricao: "", categoria: "" });

  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const [calAno, setCalAno] = useState(new Date().getFullYear());
  const [calMes, setCalMes] = useState(new Date().getMonth());

  const reloadAgendamentos = useCallback(async () => {
    const res = await api<{ agendamentos: Agendamento[] }>("/api/agendamentos");
    setAgendamentos(res.agendamentos);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    reloadAgendamentos().catch((err) => {
      const message = err instanceof Error ? err.message : "Falha ao carregar dados";
      setFeedback(message);
      if (onLoadError) onLoadError(message);
    });
  }, [enabled, onLoadError, reloadAgendamentos]);

  const filtradosAgenda = useMemo(() => {
    const texto = filtroTexto.trim().toLowerCase();
    return agendamentos
      .filter((ag) => {
        const searchable = [ag.titulo, ag.descricao, patientName(ag), patientPhone(ag), patientEmail(ag), ag.categoria].join(" ").toLowerCase();
        const matchTexto = !texto || searchable.includes(texto);
        const matchData = !filtroData || ag.data === filtroData;
        const matchStatus = filtroStatus === "todos" || (filtroStatus === "pendentes" && !ag.concluido) || (filtroStatus === "concluidos" && ag.concluido);
        return matchTexto && matchData && matchStatus;
      })
      .sort((a, b) => `${a.data}T${a.hora}`.localeCompare(`${b.data}T${b.hora}`));
  }, [agendamentos, filtroTexto, filtroData, filtroStatus]);

  const calendarMap = useMemo(() => {
    const map = new Map<string, Agendamento[]>();
    for (const ag of agendamentos) {
      const [y, m] = ag.data.split("-").map(Number);
      if (y === calAno && m === calMes + 1) {
        if (!map.has(ag.data)) map.set(ag.data, []);
        map.get(ag.data)!.push(ag);
      }
    }
    for (const list of map.values()) list.sort((a, b) => a.hora.localeCompare(b.hora));
    return map;
  }, [agendamentos, calAno, calMes]);

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(calAno, calMes, 1));
  }, [calAno, calMes]);

  const calendarCells = useMemo<ReactNode[]>(() => {
    const firstWeekday = new Date(calAno, calMes, 1).getDay();
    const daysInMonth = new Date(calAno, calMes + 1, 0).getDate();
    const todayIso = toIsoDate(new Date());

    const cells: ReactNode[] = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((d) => (
      <div key={`w-${d}`} className="calendar-weekday">{d}</div>
    ));

    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push(<div key={`empty-start-${i}`} className="calendar-day muted" />);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateIso = `${calAno}-${String(calMes + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const items = calendarMap.get(dateIso) || [];
      const classes = ["calendar-day"];
      if (dateIso === todayIso) classes.push("is-today");
      if (filtroData === dateIso) classes.push("is-selected");
      cells.push(
        <button key={dateIso} type="button" className={classes.join(" ")} onClick={() => setFiltroData(dateIso)}>
          <span className="day-number">{day}</span>
          <span className="day-times">
            {items.slice(0, 2).map((ag) => (<span key={ag.id} className="day-time">{ag.hora} {patientName(ag)}</span>))}
            {items.length > 2 && <span className="day-time">+{items.length - 2} mais</span>}
          </span>
        </button>,
      );
    }

    return cells;
  }, [calAno, calMes, calendarMap, filtroData]);

  function onPrevMonth() {
    const d = new Date(calAno, calMes - 1, 1);
    setCalAno(d.getFullYear());
    setCalMes(d.getMonth());
  }

  function onNextMonth() {
    const d = new Date(calAno, calMes + 1, 1);
    setCalAno(d.getFullYear());
    setCalMes(d.getMonth());
  }

  function onLimparFiltros() {
    setFiltroTexto("");
    setFiltroData("");
    setFiltroStatus("todos");
  }

  function handleFormChange(field: keyof AgendamentoFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleNovoPacienteFormChange(field: keyof NovoPacienteFormState, value: string) {
    setNovoPacienteForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetFormAgendamento() {
    setModoEdicao(false);
    setIdEmEdicao(null);
    setForm({ titulo: "", data: "", hora: "", descricao: "", categoria: "" });
    setModoPacienteForm("existente");
    setPacienteIdForm("");
    setNovoPacienteForm({ nome: "", telefone: "", email: "", cpf: "" });
  }

  async function syncAfterMutation() {
    if (onAfterMutation) {
      await onAfterMutation();
    }
  }

  async function onSubmitForm(e: FormEvent): Promise<void> {
    e.preventDefault();
    setFeedback("");
    const required = [form.titulo, form.data, form.hora, form.categoria];
    if (required.some((v) => !v.trim())) {
      setFeedback("Preencha os campos obrigatorios do agendamento.");
      return;
    }

    const payload: Record<string, unknown> = { ...form };
    if (modoPacienteForm === "existente") {
      if (!pacienteIdForm.trim()) {
        setFeedback("Selecione um paciente existente.");
        return;
      }
      payload.pacienteId = pacienteIdForm;
    } else {
      const patientRequired = [novoPacienteForm.nome, novoPacienteForm.telefone, novoPacienteForm.email, novoPacienteForm.cpf];
      if (patientRequired.some((v) => !v.trim())) {
        setFeedback("Para novo paciente, informe nome, telefone, email e CPF.");
        return;
      }
      payload.paciente = novoPacienteForm;
    }

    try {
      if (modoEdicao && idEmEdicao) {
        await api(`/api/agendamentos/${idEmEdicao}`, { method: "PUT", body: JSON.stringify(payload) });
        setFeedback("Agendamento atualizado com sucesso.");
      } else {
        await api("/api/agendamentos", { method: "POST", body: JSON.stringify(payload) });
        setFeedback("Agendamento criado com sucesso.");
      }
      await Promise.all([reloadAgendamentos(), syncAfterMutation()]);
      resetFormAgendamento();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Falha ao salvar");
    }
  }

  function editar(ag: Agendamento) {
    setModoEdicao(true);
    setIdEmEdicao(ag.id);
    setForm({ titulo: ag.titulo, data: ag.data, hora: ag.hora, descricao: ag.descricao, categoria: ag.categoria });
    setModoPacienteForm("existente");
    setPacienteIdForm(ag.pacienteId);
    setNovoPacienteForm({ nome: "", telefone: "", email: "", cpf: "" });
  }

  async function toggleStatus(ag: Agendamento): Promise<void> {
    await api(`/api/agendamentos/${ag.id}`, { method: "PUT", body: JSON.stringify({ ...ag, concluido: !ag.concluido }) });
    await reloadAgendamentos();
  }

  async function excluir(ag: Agendamento): Promise<void> {
    if (!window.confirm(`Deseja excluir o agendamento de ${patientName(ag)}?`)) return;
    await api(`/api/agendamentos/${ag.id}`, { method: "DELETE" });
    await Promise.all([reloadAgendamentos(), syncAfterMutation()]);
  }

  return {
    agendamentos,
    filtroTexto,
    filtroData,
    filtroStatus,
    filtradosAgenda,
    calAno,
    calMes,
    monthLabel,
    calendarCells,
    modoPacienteForm,
    pacienteIdForm,
    novoPacienteForm,
    form,
    modoEdicao,
    feedback,
    setFiltroTexto,
    setFiltroData,
    setFiltroStatus,
    setModoPacienteForm,
    setPacienteIdForm,
    setForm,
    setNovoPacienteForm,
    setFeedback,
    reloadAgendamentos,
    onPrevMonth,
    onNextMonth,
    onLimparFiltros,
    handleFormChange,
    handleNovoPacienteFormChange,
    resetFormAgendamento,
    onSubmitForm,
    editar,
    toggleStatus,
    excluir,
  };
}
