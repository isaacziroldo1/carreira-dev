import type { AgendamentoRecord, DataStore, Paciente, ProntuarioPaciente } from "../types";
import { formatCpf, normalizeEmail } from "../utils/format";

export function sanitizePacienteInput(body: unknown): { nome: string; telefone: string; email: string; cpf: string } {
  const input = (body || {}) as Record<string, unknown>;
  return {
    nome: String(input.nome || "").trim(),
    telefone: String(input.telefone || "").trim(),
    email: normalizeEmail(String(input.email || "")),
    cpf: formatCpf(String(input.cpf || "")),
  };
}

export function expandAgendamento(ag: AgendamentoRecord, data: DataStore): AgendamentoRecord & { paciente: Paciente | null } {
  const paciente = data.pacientes.find((p) => p.id === ag.pacienteId);
  return {
    ...ag,
    paciente: paciente || null,
  };
}

export function getOrCreateProntuarioByPacienteId(data: DataStore, pacienteId: string): ProntuarioPaciente {
  const found = data.prontuarios.find((p) => p.pacienteId === pacienteId);
  if (found) return found;

  const novo: ProntuarioPaciente = {
    pacienteId,
    observacoes: "",
    diagnosticos: "",
    examesRealizados: "",
    registros: [],
    atualizadoEm: new Date().toISOString(),
  };
  data.prontuarios.push(novo);
  return novo;
}

export function resolvePacienteByKey(data: DataStore, keyRaw: string): { paciente: Paciente | null; deprecatedEmail: boolean } {
  const key = String(keyRaw || "").trim();
  if (!key) return { paciente: null, deprecatedEmail: false };

  const byId = data.pacientes.find((p) => p.id === key);
  if (byId) return { paciente: byId, deprecatedEmail: false };

  const byEmail = data.pacientes.find((p) => normalizeEmail(p.email) === normalizeEmail(key));
  if (byEmail) return { paciente: byEmail, deprecatedEmail: true };

  return { paciente: null, deprecatedEmail: false };
}
