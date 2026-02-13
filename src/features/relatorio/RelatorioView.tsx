import type { Agendamento, PeriodoRelatorio, RelatorioResumo } from "../../app/types";
import { formatDate, patientName } from "../../app/utils";

type RelatorioViewProps = {
  periodoRelatorio: PeriodoRelatorio;
  customInicio: string;
  customFim: string;
  relatorio: RelatorioResumo;
  onPeriodoRelatorioChange: (periodo: PeriodoRelatorio) => void;
  onCustomInicioChange: (value: string) => void;
  onCustomFimChange: (value: string) => void;
  onAbrirPacienteByAgendamento: (ag: Agendamento) => void;
  onIrParaAgenda: () => void;
};

export function RelatorioView({
  periodoRelatorio,
  customInicio,
  customFim,
  relatorio,
  onPeriodoRelatorioChange,
  onCustomInicioChange,
  onCustomFimChange,
  onAbrirPacienteByAgendamento,
  onIrParaAgenda,
}: RelatorioViewProps) {
  return (
    <section className="view is-visible">
      <header className="view-header"><h2>Resumo geral</h2><p>Painel operacional para acompanhar os proximos atendimentos e riscos.</p></header>
      <section className="report-toolbar" aria-label="Periodo do relatorio">
        <div className="period-selector" role="group" aria-label="Selecionar periodo">
          <button type="button" className={`period-btn ${periodoRelatorio === "hoje" ? "is-active" : ""}`} onClick={() => onPeriodoRelatorioChange("hoje")}>Hoje</button>
          <button type="button" className={`period-btn ${periodoRelatorio === "prox7d" ? "is-active" : ""}`} onClick={() => onPeriodoRelatorioChange("prox7d")}>Prox 7 dias</button>
          <button type="button" className={`period-btn ${periodoRelatorio === "prox30d" ? "is-active" : ""}`} onClick={() => onPeriodoRelatorioChange("prox30d")}>Prox 30 dias</button>
          <button type="button" className={`period-btn ${periodoRelatorio === "ult7d" ? "is-active" : ""}`} onClick={() => onPeriodoRelatorioChange("ult7d")}>Ult 7 dias</button>
          <button type="button" className={`period-btn ${periodoRelatorio === "ult30d" ? "is-active" : ""}`} onClick={() => onPeriodoRelatorioChange("ult30d")}>Ult 30 dias</button>
          <button type="button" className={`period-btn ${periodoRelatorio === "custom" ? "is-active" : ""}`} onClick={() => onPeriodoRelatorioChange("custom")}>Personalizado</button>
        </div>
        {periodoRelatorio === "custom" && (
          <div className="custom-range-fields">
            <label className="custom-range-field">Inicio<input type="date" value={customInicio} onChange={(e) => onCustomInicioChange(e.target.value)} /></label>
            <label className="custom-range-field">Fim<input type="date" value={customFim} onChange={(e) => onCustomFimChange(e.target.value)} /></label>
          </div>
        )}
        {!relatorio.periodoValido && <p className="report-warning">Data inicial deve ser menor ou igual a data final.</p>}
      </section>
      <p className="report-period-note">Periodo selecionado: {relatorio.periodoLabel}</p>

      <section className="stats-grid">
        <article className="stat-card"><p>Atendimentos no periodo</p><strong>{relatorio.totalPeriodo}</strong></article>
        <article className="stat-card"><p>Pendentes no periodo</p><strong>{relatorio.pendentesPeriodo}</strong></article>
        <article className="stat-card"><p>Concluidos no periodo</p><strong>{relatorio.concluidosPeriodo}</strong></article>
        <article className="stat-card"><p>Taxa de conclusao</p><strong>{relatorio.taxaConclusao}%</strong></article>
        <article className="stat-card is-alert"><p>Atrasados</p><strong>{relatorio.atrasadosQtd}</strong></article>
        <article className="stat-card"><p>Hoje</p><strong>{relatorio.hojeQtd}</strong></article>
      </section>

      <section className="report-grid">
        <section className="panel report-panel">
          <header className="panel-header"><h2>Proximos atendimentos</h2><p>Agenda imediata para os proximos horarios.</p></header>
          {relatorio.proximosAtendimentos.length === 0 && <div className="empty-state"><p>Nenhum atendimento futuro encontrado.</p></div>}
          {relatorio.proximosAtendimentos.length > 0 && (
            <div className="report-list">
              {relatorio.proximosAtendimentos.map((ag) => (
                <button key={ag.id} type="button" className="report-item report-item-btn" onClick={() => onAbrirPacienteByAgendamento(ag)}>
                  <div className="report-item-main"><strong>{patientName(ag)}</strong><span>{ag.categoria}</span></div>
                  <div className="report-item-meta"><span>{formatDate(ag.data)}</span><span>{ag.hora}</span></div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="panel report-panel">
          <header className="panel-header"><h2>Pendencias criticas</h2><p>Itens atrasados que exigem acao imediata.</p></header>
          {relatorio.pendenciasCriticas.length === 0 && <div className="empty-state"><p>Nenhuma pendencia critica no momento.</p></div>}
          {relatorio.pendenciasCriticas.length > 0 && (
            <div className="report-list">
              {relatorio.pendenciasCriticas.map((ag) => (
                <button key={ag.id} type="button" className="report-item report-item-btn" onClick={() => onAbrirPacienteByAgendamento(ag)}>
                  <div className="report-item-main"><strong>{patientName(ag)}</strong><span>{ag.titulo}</span></div>
                  <div className="report-item-meta"><span>{formatDate(ag.data)}</span><span>{ag.hora}</span></div>
                </button>
              ))}
            </div>
          )}
          <button type="button" className="btn btn-secondary report-action" onClick={onIrParaAgenda}>Ir para Agenda</button>
        </section>

        <section className="panel report-panel report-distribution">
          <header className="panel-header"><h2>Distribuicao por categoria</h2><p>Volume de atendimentos por tipo no periodo selecionado.</p></header>
          <div className="distribution-list">
            {relatorio.distribuicaoCategoria.map((item) => (
              <div key={item.categoria} className="distribution-item">
                <div className="distribution-header"><strong>{item.categoria}</strong><span>{item.qtd} ({item.percentual}%)</span></div>
                <div className="distribution-bar-track"><div className="distribution-bar-fill" style={{ width: `${item.percentual}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </section>
  );
}
