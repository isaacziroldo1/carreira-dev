import { useState } from "react";
import type { ViewName } from "./app/types";
import { AgendaView } from "./features/agenda/AgendaView";
import { useAgenda } from "./features/agenda/useAgenda";
import { AgendamentoFormView } from "./features/agendamento/AgendamentoFormView";
import { LoginView } from "./features/auth/LoginView";
import { Sidebar } from "./features/layout/Sidebar";
import { PacienteView } from "./features/pacientes/PacienteView";
import { PacientesView } from "./features/pacientes/PacientesView";
import { usePacientes } from "./features/pacientes/usePacientes";
import { useProntuario } from "./features/pacientes/useProntuario";
import { RelatorioView } from "./features/relatorio/RelatorioView";
import { useRelatorio } from "./features/relatorio/useRelatorio";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const [view, setView] = useState<ViewName>("relatorio");

  const { theme, toggleTheme } = useTheme();
  const {
    auth,
    loginUser,
    loginPass,
    loginFeedback,
    isLoggedIn,
    setLoginUser,
    setLoginPass,
    handleLogin,
    logout,
  } = useAuth();

  const pacientes = usePacientes({ enabled: isLoggedIn });

  const agenda = useAgenda({
    enabled: isLoggedIn,
    onAfterMutation: pacientes.reloadPacientes,
  });

  const prontuario = useProntuario({
    enabled: isLoggedIn,
    view,
    reloadAgendamentos: agenda.reloadAgendamentos,
    reloadPacientes: pacientes.reloadPacientes,
  });

  const relatorio = useRelatorio({ agendamentos: agenda.agendamentos });

  function abrirPacienteByAgendamento(ag: Parameters<typeof prontuario.abrirPacienteByAgendamento>[0]) {
    prontuario.abrirPacienteByAgendamento(ag);
    setView("paciente");
  }

  function abrirPacienteResumo(p: Parameters<typeof prontuario.abrirPacienteResumo>[0]) {
    prontuario.abrirPacienteResumo(p);
    setView("paciente");
  }

  function editarAgendamento(ag: Parameters<typeof agenda.editar>[0]) {
    agenda.editar(ag);
    setView("novo");
  }

  if (auth.status === "loading") return <div className="login-shell">Carregando...</div>;

  if (auth.status === "logged_out") {
    return (
      <LoginView
        loginUser={loginUser}
        loginPass={loginPass}
        loginFeedback={loginFeedback}
        onSubmit={handleLogin}
        onLoginUserChange={setLoginUser}
        onLoginPassChange={setLoginPass}
      />
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        view={view}
        theme={theme}
        onViewChange={setView}
        onToggleTheme={toggleTheme}
        onLogout={logout}
      />

      <main className="workspace">
        {view === "relatorio" && (
          <RelatorioView
            periodoRelatorio={relatorio.periodoRelatorio}
            customInicio={relatorio.customInicio}
            customFim={relatorio.customFim}
            relatorio={relatorio.relatorio}
            onPeriodoRelatorioChange={relatorio.setPeriodoRelatorio}
            onCustomInicioChange={relatorio.setCustomInicio}
            onCustomFimChange={relatorio.setCustomFim}
            onAbrirPacienteByAgendamento={abrirPacienteByAgendamento}
            onIrParaAgenda={() => setView("agenda")}
          />
        )}

        {view === "novo" && (
          <AgendamentoFormView
            modoEdicao={agenda.modoEdicao}
            form={agenda.form}
            modoPacienteForm={agenda.modoPacienteForm}
            pacienteIdForm={agenda.pacienteIdForm}
            novoPacienteForm={agenda.novoPacienteForm}
            pacientes={pacientes.pacientes}
            feedback={agenda.feedback}
            onSubmit={agenda.onSubmitForm}
            onReset={agenda.resetFormAgendamento}
            onFormChange={agenda.handleFormChange}
            onModoPacienteFormChange={agenda.setModoPacienteForm}
            onPacienteIdFormChange={agenda.setPacienteIdForm}
            onNovoPacienteFormChange={agenda.handleNovoPacienteFormChange}
          />
        )}

        {view === "pacientes" && (
          <PacientesView
            filtroPaciente={pacientes.filtroPaciente}
            pacientesFiltrados={pacientes.pacientesFiltrados}
            onFiltroPacienteChange={pacientes.setFiltroPaciente}
            onAbrirPacienteResumo={abrirPacienteResumo}
          />
        )}

        {view === "paciente" && (
          <PacienteView
            pacienteSelecionado={prontuario.pacienteSelecionado}
            prontuario={prontuario.prontuario}
            historicoPaciente={prontuario.historicoPaciente}
            prontuarioLoading={prontuario.prontuarioLoading}
            prontuarioFeedback={prontuario.prontuarioFeedback}
            novoRegistro={prontuario.novoRegistro}
            onVoltarPacientes={() => setView("pacientes")}
            onVoltarRelatorio={() => setView("relatorio")}
            onAtualizarIdentificacaoPaciente={prontuario.atualizarIdentificacaoPaciente}
            onAtualizarCampoProntuario={prontuario.atualizarCampoProntuario}
            onSalvarCadastroPaciente={prontuario.salvarCadastroPaciente}
            onSalvarProntuario={prontuario.salvarProntuario}
            onNovoRegistroChange={prontuario.handleNovoRegistroChange}
            onAdicionarRegistroProntuario={prontuario.adicionarRegistroProntuario}
            onLimparNovoRegistro={prontuario.limparNovoRegistro}
            onRemoverRegistroProntuario={prontuario.removerRegistroProntuario}
          />
        )}

        {view === "agenda" && (
          <AgendaView
            monthLabel={agenda.monthLabel}
            calendarCells={agenda.calendarCells}
            filtroTexto={agenda.filtroTexto}
            filtroData={agenda.filtroData}
            filtroStatus={agenda.filtroStatus}
            filtradosAgenda={agenda.filtradosAgenda}
            onPrevMonth={agenda.onPrevMonth}
            onNextMonth={agenda.onNextMonth}
            onFiltroTextoChange={agenda.setFiltroTexto}
            onFiltroDataChange={agenda.setFiltroData}
            onFiltroStatusChange={agenda.setFiltroStatus}
            onLimparFiltros={agenda.onLimparFiltros}
            onToggleStatus={agenda.toggleStatus}
            onEditar={editarAgendamento}
            onExcluir={agenda.excluir}
            onAbrirPacienteByAgendamento={abrirPacienteByAgendamento}
          />
        )}
      </main>
    </div>
  );
}
