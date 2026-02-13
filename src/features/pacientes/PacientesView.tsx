import type { PacienteResumo } from "../../app/types";
import { formatDate } from "../../app/utils";

type PacientesViewProps = {
  filtroPaciente: string;
  pacientesFiltrados: PacienteResumo[];
  onFiltroPacienteChange: (value: string) => void;
  onAbrirPacienteResumo: (paciente: PacienteResumo) => void;
};

export function PacientesView({
  filtroPaciente,
  pacientesFiltrados,
  onFiltroPacienteChange,
  onAbrirPacienteResumo,
}: PacientesViewProps) {
  return (
    <section className="view is-visible">
      <section className="panel">
        <header className="panel-header"><h2>Pacientes</h2><p>Selecione um paciente para abrir cadastro e prontuario.</p></header>
        <div className="patients-toolbar">
          <label>Buscar paciente<input value={filtroPaciente} onChange={(e) => onFiltroPacienteChange(e.target.value)} placeholder="Nome, CPF, email ou telefone" /></label>
          <p className="patients-count">Total: {pacientesFiltrados.length}</p>
        </div>
        {pacientesFiltrados.length === 0 && <div className="empty-state"><p>Nenhum paciente encontrado.</p></div>}
        {pacientesFiltrados.length > 0 && (
          <div className="patients-list">
            {pacientesFiltrados.map((p) => (
              <article key={p.id} className="patient-card">
                <div className="patient-card-main"><strong>{p.nome}</strong><span>{p.cpf}</span><span>{p.email}</span><span>{p.telefone || "-"}</span></div>
                <div className="patient-card-meta"><span>{p.totalAgendamentos} agendamento(s)</span><span>Ultimo: {p.ultimoAgendamento ? formatDate(p.ultimoAgendamento.slice(0, 10)) : "-"}</span></div>
                <button type="button" className="btn btn-secondary" onClick={() => onAbrirPacienteResumo(p)}>Abrir prontuario</button>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
