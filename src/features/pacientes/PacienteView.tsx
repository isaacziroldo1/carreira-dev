import { REGISTRO_TIPOS, type Agendamento, type NovoRegistroState, type Paciente, type ProntuarioPaciente } from "../../app/types";
import { formatDate } from "../../app/utils";

type PacienteViewProps = {
  pacienteSelecionado: Paciente | null;
  prontuario: ProntuarioPaciente | null;
  historicoPaciente: Agendamento[];
  prontuarioLoading: boolean;
  prontuarioFeedback: string;
  novoRegistro: NovoRegistroState;
  onVoltarPacientes: () => void;
  onVoltarRelatorio: () => void;
  onAtualizarIdentificacaoPaciente: (campo: "nome" | "telefone" | "email" | "cpf", valor: string) => void;
  onAtualizarCampoProntuario: (campo: "observacoes" | "diagnosticos" | "examesRealizados", valor: string) => void;
  onSalvarCadastroPaciente: () => Promise<void>;
  onSalvarProntuario: () => Promise<void>;
  onNovoRegistroChange: (campo: keyof NovoRegistroState, valor: string) => void;
  onAdicionarRegistroProntuario: () => void;
  onLimparNovoRegistro: () => void;
  onRemoverRegistroProntuario: (id: string) => void;
};

export function PacienteView({
  pacienteSelecionado,
  prontuario,
  historicoPaciente,
  prontuarioLoading,
  prontuarioFeedback,
  novoRegistro,
  onVoltarPacientes,
  onVoltarRelatorio,
  onAtualizarIdentificacaoPaciente,
  onAtualizarCampoProntuario,
  onSalvarCadastroPaciente,
  onSalvarProntuario,
  onNovoRegistroChange,
  onAdicionarRegistroProntuario,
  onLimparNovoRegistro,
  onRemoverRegistroProntuario,
}: PacienteViewProps) {
  return (
    <section className="view is-visible">
      <section className="panel">
        <header className="panel-header"><h2>Ficha do paciente</h2><p>Edite cadastro, prontuario e acompanhe o historico de agendamentos.</p></header>
        {!pacienteSelecionado && <div className="empty-state"><p>Nenhum paciente selecionado.</p></div>}
        {pacienteSelecionado && (
          <div className="patient-view">
            <section className="patient-head">
              <div><strong>{pacienteSelecionado.nome}</strong><p>{pacienteSelecionado.cpf}</p><p>{pacienteSelecionado.email}</p><p>{pacienteSelecionado.telefone || "-"}</p></div>
              <div className="patient-head-actions">
                <button type="button" className="btn btn-secondary" onClick={onVoltarPacientes}>Voltar para Pacientes</button>
                <button type="button" className="btn btn-secondary" onClick={onVoltarRelatorio}>Voltar para Relatorio</button>
              </div>
            </section>
            {prontuarioLoading && <p className="feedback">Carregando prontuario...</p>}
            {!prontuarioLoading && (
              <>
                <section className="patient-grid">
                  <label>Nome do paciente<input value={pacienteSelecionado.nome} onChange={(e) => onAtualizarIdentificacaoPaciente("nome", e.target.value)} /></label>
                  <label>Telefone do paciente<input value={pacienteSelecionado.telefone} onChange={(e) => onAtualizarIdentificacaoPaciente("telefone", e.target.value)} /></label>
                  <label>Email do paciente<input value={pacienteSelecionado.email} onChange={(e) => onAtualizarIdentificacaoPaciente("email", e.target.value)} /></label>
                  <label>CPF<input value={pacienteSelecionado.cpf} onChange={(e) => onAtualizarIdentificacaoPaciente("cpf", e.target.value)} /></label>
                  {prontuario && (
                    <>
                      <label>Observacoes<textarea rows={4} value={prontuario.observacoes} onChange={(e) => onAtualizarCampoProntuario("observacoes", e.target.value)} /></label>
                      <label>Diagnosticos<textarea rows={4} value={prontuario.diagnosticos} onChange={(e) => onAtualizarCampoProntuario("diagnosticos", e.target.value)} /></label>
                      <label className="full">Exames ja realizados<textarea rows={4} value={prontuario.examesRealizados} onChange={(e) => onAtualizarCampoProntuario("examesRealizados", e.target.value)} /></label>
                    </>
                  )}
                </section>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => void onSalvarCadastroPaciente()}>Salvar cadastro do paciente</button>
                  <button type="button" className="btn btn-primary" onClick={() => void onSalvarProntuario()}>Salvar prontuario</button>
                </div>
                {prontuario && (
                  <section className="patient-records">
                    <h3>Registros clinicos</h3>
                    <div className="records-new">
                      <label>Data<input type="date" value={novoRegistro.data} onChange={(e) => onNovoRegistroChange("data", e.target.value)} /></label>
                      <label>Tipo
                        <select value={novoRegistro.tipo} onChange={(e) => onNovoRegistroChange("tipo", e.target.value)}>
                          {REGISTRO_TIPOS.map((tipo) => (<option key={tipo} value={tipo}>{tipo}</option>))}
                        </select>
                      </label>
                      <label className="full">Descricao<textarea rows={3} value={novoRegistro.descricao} onChange={(e) => onNovoRegistroChange("descricao", e.target.value)} /></label>
                      <button type="button" className="btn btn-secondary" onClick={onAdicionarRegistroProntuario}>Adicionar registro</button>
                      <button type="button" className="btn btn-secondary" onClick={onLimparNovoRegistro}>Limpar campos do registro</button>
                    </div>
                    {prontuario.registros.length === 0 && <div className="empty-state"><p>Sem registros clinicos para este paciente.</p></div>}
                    {prontuario.registros.length > 0 && (
                      <div className="records-list">
                        {prontuario.registros.slice().sort((a, b) => b.data.localeCompare(a.data)).map((registro) => (
                          <article key={registro.id} className="record-item">
                            <header><strong>{registro.tipo}</strong><span>{formatDate(registro.data)}</span></header>
                            <p>{registro.descricao}</p>
                            <button type="button" className="btn btn-secondary" onClick={() => onRemoverRegistroProntuario(registro.id)}>Remover</button>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>
                )}
                <section className="patient-records">
                  <h3>Historico de agendamentos</h3>
                  {historicoPaciente.length === 0 && <div className="empty-state"><p>Sem agendamentos para este paciente.</p></div>}
                  {historicoPaciente.length > 0 && (
                    <div className="records-list">
                      {historicoPaciente.map((ag) => (
                        <article key={ag.id} className="record-item">
                          <header><strong>{ag.titulo}</strong><span>{formatDate(ag.data)} as {ag.hora}</span></header>
                          <p>{ag.categoria} {ag.concluido ? "(Concluido)" : "(Pendente)"}</p>
                          {ag.descricao && <p>{ag.descricao}</p>}
                        </article>
                      ))}
                    </div>
                  )}
                </section>
                <p className="feedback">{prontuarioFeedback}</p>
              </>
            )}
          </div>
        )}
      </section>
    </section>
  );
}
