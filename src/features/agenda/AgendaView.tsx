import type { ReactNode } from "react";
import type { Agendamento, StatusFiltro } from "../../app/types";
import { formatDate, patientEmail, patientName, patientPhone } from "../../app/utils";

type AgendaViewProps = {
  monthLabel: string;
  calendarCells: ReactNode[];
  filtroTexto: string;
  filtroData: string;
  filtroStatus: StatusFiltro;
  filtradosAgenda: Agendamento[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onFiltroTextoChange: (value: string) => void;
  onFiltroDataChange: (value: string) => void;
  onFiltroStatusChange: (value: StatusFiltro) => void;
  onLimparFiltros: () => void;
  onToggleStatus: (ag: Agendamento) => Promise<void>;
  onEditar: (ag: Agendamento) => void;
  onExcluir: (ag: Agendamento) => Promise<void>;
  onAbrirPacienteByAgendamento: (ag: Agendamento) => void;
};

export function AgendaView({
  monthLabel,
  calendarCells,
  filtroTexto,
  filtroData,
  filtroStatus,
  filtradosAgenda,
  onPrevMonth,
  onNextMonth,
  onFiltroTextoChange,
  onFiltroDataChange,
  onFiltroStatusChange,
  onLimparFiltros,
  onToggleStatus,
  onEditar,
  onExcluir,
  onAbrirPacienteByAgendamento,
}: AgendaViewProps) {
  return (
    <section className="view is-visible">
      <div className="agenda-grid">
        <section className="panel calendar-panel">
          <header className="calendar-head">
            <h2>Calendario</h2>
            <div className="calendar-controls">
              <button className="btn btn-secondary" onClick={onPrevMonth}>Anterior</button>
              <strong>{monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}</strong>
              <button className="btn btn-secondary" onClick={onNextMonth}>Proximo</button>
            </div>
          </header>
          <div className="calendar-grid">{calendarCells}</div>
        </section>
        <section className="panel agenda-panel">
          <header className="panel-header"><h2>Agenda</h2><p>Busque e filtre seus compromissos.</p></header>
          <div className="filter-grid">
            <label>Buscar<input value={filtroTexto} onChange={(e) => onFiltroTextoChange(e.target.value)} /></label>
            <label>Data<input type="date" value={filtroData} onChange={(e) => onFiltroDataChange(e.target.value)} /></label>
            <label>Status
              <select value={filtroStatus} onChange={(e) => onFiltroStatusChange(e.target.value as StatusFiltro)}>
                <option value="todos">Todos</option>
                <option value="pendentes">Pendentes</option>
                <option value="concluidos">Concluidos</option>
              </select>
            </label>
            <button className="btn btn-secondary filter-reset" onClick={onLimparFiltros}>Limpar filtros</button>
          </div>
          <div className="list">
            {filtradosAgenda.length === 0 && <div className="empty-state"><p>Nenhum agendamento encontrado com os filtros atuais.</p><p>Ajuste os filtros ou cadastre um novo atendimento.</p></div>}
            {filtradosAgenda.map((ag) => (
              <article key={ag.id} className={`agendamento-item ${ag.concluido ? "is-concluido" : ""}`}>
                <div className="agendamento-top"><div><h3 className="agendamento-titulo">{ag.titulo}</h3><p className="agendamento-meta">{formatDate(ag.data)} as {ag.hora}</p></div><span className="badge">{ag.concluido ? "Concluido" : "Pendente"}</span></div>
                <div className="agendamento-cliente"><span className="cliente-nome">{patientName(ag)}</span><span className="cliente-contato">{patientPhone(ag)} | {patientEmail(ag)}</span><span className="categoria-tag">{ag.categoria}</span></div>
                {ag.descricao && <p className="agendamento-desc">{ag.descricao}</p>}
                <div className="agendamento-actions">
                  <button className="btn btn-secondary" onClick={() => void onToggleStatus(ag)}>{ag.concluido ? "Reabrir" : "Concluir"}</button>
                  <button className="btn btn-secondary" onClick={() => onEditar(ag)}>Editar</button>
                  <button className="btn btn-secondary" onClick={() => void onExcluir(ag)}>Excluir</button>
                  <button className="btn btn-secondary" onClick={() => onAbrirPacienteByAgendamento(ag)}>Prontuario</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
