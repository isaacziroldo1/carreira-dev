import type { FormEvent } from "react";
import type {
  AgendamentoFormState,
  ModoPaciente,
  NovoPacienteFormState,
  PacienteResumo,
} from "../../app/types";

type AgendamentoFormViewProps = {
  modoEdicao: boolean;
  form: AgendamentoFormState;
  modoPacienteForm: ModoPaciente;
  pacienteIdForm: string;
  novoPacienteForm: NovoPacienteFormState;
  pacientes: PacienteResumo[];
  feedback: string;
  onSubmit: (e: FormEvent) => void;
  onReset: () => void;
  onFormChange: (field: keyof AgendamentoFormState, value: string) => void;
  onModoPacienteFormChange: (modo: ModoPaciente) => void;
  onPacienteIdFormChange: (value: string) => void;
  onNovoPacienteFormChange: (field: keyof NovoPacienteFormState, value: string) => void;
};

export function AgendamentoFormView({
  modoEdicao,
  form,
  modoPacienteForm,
  pacienteIdForm,
  novoPacienteForm,
  pacientes,
  feedback,
  onSubmit,
  onReset,
  onFormChange,
  onModoPacienteFormChange,
  onPacienteIdFormChange,
  onNovoPacienteFormChange,
}: AgendamentoFormViewProps) {
  return (
    <section className="view is-visible">
      <section className="panel">
        <header className="panel-header"><h2>{modoEdicao ? "Editar agendamento de consulta" : "Novo agendamento de consulta"}</h2><p>Selecione paciente existente ou crie um novo no mesmo fluxo.</p></header>
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <label>Titulo da consulta *<input value={form.titulo} onChange={(e) => onFormChange("titulo", e.target.value)} /></label>
            <label>Data *<input type="date" value={form.data} onChange={(e) => onFormChange("data", e.target.value)} /></label>
            <label>Hora *<input type="time" value={form.hora} onChange={(e) => onFormChange("hora", e.target.value)} /></label>
            <label>Categoria *
              <select value={form.categoria} onChange={(e) => onFormChange("categoria", e.target.value)}>
                <option value="">Selecione</option>
                <option value="Primeira consulta">Primeira consulta</option>
                <option value="Retorno">Retorno</option>
                <option value="Exame">Exame</option>
                <option value="Procedimento">Procedimento</option>
              </select>
            </label>
            <label className="full">Descricao<textarea rows={3} value={form.descricao} onChange={(e) => onFormChange("descricao", e.target.value)} /></label>
          </div>

          <section className="panel patient-inline-panel">
            <header className="panel-header"><h2>Paciente</h2><p>Escolha o modo de vinculacao para este agendamento.</p></header>
            <div className="patient-head-actions">
              <button type="button" className={`btn btn-secondary ${modoPacienteForm === "existente" ? "is-active" : ""}`} onClick={() => onModoPacienteFormChange("existente")}>Selecionar existente</button>
              <button type="button" className={`btn btn-secondary ${modoPacienteForm === "novo" ? "is-active" : ""}`} onClick={() => onModoPacienteFormChange("novo")}>Criar novo paciente</button>
            </div>
            {modoPacienteForm === "existente" && (
              <label>Paciente *
                <select value={pacienteIdForm} onChange={(e) => onPacienteIdFormChange(e.target.value)}>
                  <option value="">Selecione</option>
                  {pacientes.map((p) => (<option key={p.id} value={p.id}>{p.nome} | {p.cpf}</option>))}
                </select>
              </label>
            )}
            {modoPacienteForm === "novo" && (
              <div className="form-grid">
                <label>Nome *<input value={novoPacienteForm.nome} onChange={(e) => onNovoPacienteFormChange("nome", e.target.value)} /></label>
                <label>Telefone *<input value={novoPacienteForm.telefone} onChange={(e) => onNovoPacienteFormChange("telefone", e.target.value)} /></label>
                <label>Email *<input type="email" value={novoPacienteForm.email} onChange={(e) => onNovoPacienteFormChange("email", e.target.value)} /></label>
                <label>CPF *<input value={novoPacienteForm.cpf} onChange={(e) => onNovoPacienteFormChange("cpf", e.target.value)} /></label>
              </div>
            )}
          </section>

          <p className="feedback">{feedback}</p>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit">{modoEdicao ? "Salvar alteracoes" : "Salvar agendamento"}</button>
            <button className="btn btn-secondary" type="button" onClick={onReset}>Limpar formulario</button>
          </div>
        </form>
      </section>
    </section>
  );
}
