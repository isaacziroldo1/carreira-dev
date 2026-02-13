import type { FormEvent, ReactNode } from "react";

export type ViewName = "relatorio" | "novo" | "agenda" | "pacientes" | "paciente";
export type StatusFiltro = "todos" | "pendentes" | "concluidos";
export type PeriodoRelatorio = "hoje" | "prox7d" | "prox30d" | "ult7d" | "ult30d" | "custom";
export type CategoriaRelatorio = "Primeira consulta" | "Retorno" | "Exame" | "Procedimento";
export type CategoriaAgendamento = CategoriaRelatorio;
export type TipoRegistroClinico = "Exame" | "Diagnostico" | "Evolucao" | "Conduta" | "Observacao";
export type ModoPaciente = "existente" | "novo";
export type ThemeMode = "light" | "dark";

export type RangeRelatorio = { inicio: Date; fim: Date; valido: boolean; label: string };

export type Paciente = {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  cpf: string;
  dataCriacao: string;
  atualizadoEm: string;
};

export type PacienteResumo = Paciente & { totalAgendamentos: number; ultimoAgendamento: string };

export type Agendamento = {
  id: string;
  pacienteId: string;
  titulo: string;
  data: string;
  hora: string;
  descricao: string;
  categoria: CategoriaAgendamento;
  concluido: boolean;
  dataCriacao: string;
  paciente: Paciente | null;
};

export type RegistroClinico = {
  id: string;
  data: string;
  tipo: TipoRegistroClinico;
  descricao: string;
};

export type ProntuarioPaciente = {
  pacienteId: string;
  observacoes: string;
  diagnosticos: string;
  examesRealizados: string;
  registros: RegistroClinico[];
  atualizadoEm: string;
};

export type AuthState = { status: "loading" } | { status: "logged_out" } | { status: "logged_in"; user: string };

export type AgendamentoFormState = {
  titulo: string;
  data: string;
  hora: string;
  descricao: string;
  categoria: string;
};

export type NovoPacienteFormState = {
  nome: string;
  telefone: string;
  email: string;
  cpf: string;
};

export type NovoRegistroState = {
  data: string;
  tipo: TipoRegistroClinico;
  descricao: string;
};

export type RelatorioResumo = {
  totalPeriodo: number;
  pendentesPeriodo: number;
  concluidosPeriodo: number;
  taxaConclusao: number;
  periodoValido: boolean;
  periodoLabel: string;
  atrasadosQtd: number;
  hojeQtd: number;
  proximosAtendimentos: Agendamento[];
  pendenciasCriticas: Agendamento[];
  distribuicaoCategoria: Array<{ categoria: CategoriaRelatorio; qtd: number; percentual: number }>;
};

export const RELATORIO_CATEGORIAS: CategoriaRelatorio[] = ["Primeira consulta", "Retorno", "Exame", "Procedimento"];
export const REGISTRO_TIPOS: TipoRegistroClinico[] = ["Exame", "Diagnostico", "Evolucao", "Conduta", "Observacao"];

export type UseThemeResult = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

export type UseAuthResult = {
  auth: AuthState;
  loginUser: string;
  loginPass: string;
  loginFeedback: string;
  isLoggedIn: boolean;
  setLoginUser: (value: string) => void;
  setLoginPass: (value: string) => void;
  handleLogin: (e: FormEvent) => Promise<void>;
  logout: () => void;
};

export type UsePacientesParams = {
  enabled: boolean;
  onLoadError?: (message: string) => void;
};

export type UsePacientesResult = {
  pacientes: PacienteResumo[];
  filtroPaciente: string;
  pacientesFiltrados: PacienteResumo[];
  setFiltroPaciente: (value: string) => void;
  reloadPacientes: () => Promise<void>;
};

export type UseAgendaParams = {
  enabled: boolean;
  onLoadError?: (message: string) => void;
  onAfterMutation?: () => Promise<void>;
};

export type UseAgendaResult = {
  agendamentos: Agendamento[];
  filtroTexto: string;
  filtroData: string;
  filtroStatus: StatusFiltro;
  filtradosAgenda: Agendamento[];
  calAno: number;
  calMes: number;
  monthLabel: string;
  calendarCells: ReactNode[];
  modoPacienteForm: ModoPaciente;
  pacienteIdForm: string;
  novoPacienteForm: NovoPacienteFormState;
  form: AgendamentoFormState;
  modoEdicao: boolean;
  feedback: string;
  setFiltroTexto: (value: string) => void;
  setFiltroData: (value: string) => void;
  setFiltroStatus: (value: StatusFiltro) => void;
  setModoPacienteForm: (value: ModoPaciente) => void;
  setPacienteIdForm: (value: string) => void;
  setForm: (value: AgendamentoFormState | ((prev: AgendamentoFormState) => AgendamentoFormState)) => void;
  setNovoPacienteForm: (value: NovoPacienteFormState | ((prev: NovoPacienteFormState) => NovoPacienteFormState)) => void;
  setFeedback: (value: string) => void;
  reloadAgendamentos: () => Promise<void>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onLimparFiltros: () => void;
  handleFormChange: (field: keyof AgendamentoFormState, value: string) => void;
  handleNovoPacienteFormChange: (field: keyof NovoPacienteFormState, value: string) => void;
  resetFormAgendamento: () => void;
  onSubmitForm: (e: FormEvent) => Promise<void>;
  editar: (ag: Agendamento) => void;
  toggleStatus: (ag: Agendamento) => Promise<void>;
  excluir: (ag: Agendamento) => Promise<void>;
};

export type UseProntuarioParams = {
  enabled: boolean;
  view: ViewName;
  reloadAgendamentos: () => Promise<void>;
  reloadPacientes: () => Promise<void>;
};

export type UseProntuarioResult = {
  pacienteSelecionado: Paciente | null;
  prontuario: ProntuarioPaciente | null;
  historicoPaciente: Agendamento[];
  prontuarioLoading: boolean;
  prontuarioFeedback: string;
  novoRegistro: NovoRegistroState;
  abrirPacienteByAgendamento: (ag: Agendamento) => void;
  abrirPacienteResumo: (p: PacienteResumo) => void;
  atualizarIdentificacaoPaciente: (campo: "nome" | "telefone" | "email" | "cpf", valor: string) => void;
  atualizarCampoProntuario: (campo: "observacoes" | "diagnosticos" | "examesRealizados", valor: string) => void;
  adicionarRegistroProntuario: () => void;
  removerRegistroProntuario: (id: string) => void;
  limparNovoRegistro: () => void;
  salvarCadastroPaciente: () => Promise<void>;
  salvarProntuario: () => Promise<void>;
  handleNovoRegistroChange: (field: keyof NovoRegistroState, value: string) => void;
};

export type UseRelatorioParams = {
  agendamentos: Agendamento[];
};

export type UseRelatorioResult = {
  periodoRelatorio: PeriodoRelatorio;
  customInicio: string;
  customFim: string;
  faixaRelatorio: RangeRelatorio;
  relatorio: RelatorioResumo;
  setPeriodoRelatorio: (value: PeriodoRelatorio) => void;
  setCustomInicio: (value: string) => void;
  setCustomFim: (value: string) => void;
};
