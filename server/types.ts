import type { Request } from "express";

export type Categoria = "Primeira consulta" | "Retorno" | "Exame" | "Procedimento";
export type TipoRegistroClinico = "Exame" | "Diagnostico" | "Evolucao" | "Conduta" | "Observacao";

export type UserRecord = {
  username: string;
  passwordHash: string;
};

export type Paciente = {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  cpf: string;
  dataCriacao: string;
  atualizadoEm: string;
};

export type AgendamentoRecord = {
  id: string;
  pacienteId: string;
  titulo: string;
  data: string;
  hora: string;
  descricao: string;
  categoria: Categoria;
  concluido: boolean;
  dataCriacao: string;
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

export type DataStore = {
  seedVersion: number;
  users: UserRecord[];
  pacientes: Paciente[];
  agendamentos: AgendamentoRecord[];
  prontuarios: ProntuarioPaciente[];
};

export type LegacyAgendamentoRecord = Partial<AgendamentoRecord> & {
  clienteNome?: string;
  clienteTelefone?: string;
  clienteEmail?: string;
};

export type JwtPayload = {
  user: string;
  iat: number;
  exp: number;
};

export type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};
