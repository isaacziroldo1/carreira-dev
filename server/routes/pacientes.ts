import { randomUUID } from "node:crypto";
import { Router, type Request, type Response } from "express";
import { readData, writeData } from "../data/store";
import { authMiddleware } from "../middleware/auth";
import {
  getOrCreateProntuarioByPacienteId,
  resolvePacienteByKey,
  sanitizePacienteInput,
} from "../services/paciente";
import type { Paciente, ProntuarioPaciente, RegistroClinico, TipoRegistroClinico } from "../types";
import { formatCpf, isValidCpf, normalizeCpf, toIsoDate } from "../utils/format";

const pacientesRouter = Router();

pacientesRouter.use(authMiddleware);

pacientesRouter.get("/", (_req: Request, res: Response) => {
  const data = readData();
  const countByPacienteId = new Map<string, number>();
  const lastByPacienteId = new Map<string, string>();

  for (const ag of data.agendamentos) {
    countByPacienteId.set(ag.pacienteId, (countByPacienteId.get(ag.pacienteId) || 0) + 1);
    const stamp = `${ag.data}T${ag.hora}`;
    const current = lastByPacienteId.get(ag.pacienteId) || "";
    if (stamp > current) {
      lastByPacienteId.set(ag.pacienteId, stamp);
    }
  }

  const pacientes = data.pacientes
    .map((p) => ({
      ...p,
      totalAgendamentos: countByPacienteId.get(p.id) || 0,
      ultimoAgendamento: lastByPacienteId.get(p.id) || "",
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return res.json({ pacientes });
});

pacientesRouter.post("/", (req: Request, res: Response) => {
  const input = sanitizePacienteInput(req.body);
  if (!input.nome || !input.telefone || !input.email || !input.cpf) {
    return res.status(400).json({ message: "Nome, telefone, email e CPF sao obrigatorios." });
  }

  if (!isValidCpf(input.cpf)) {
    return res.status(400).json({ message: "CPF invalido." });
  }

  const data = readData();
  const cpfNorm = normalizeCpf(input.cpf);
  const existsCpf = data.pacientes.some((p) => normalizeCpf(p.cpf) === cpfNorm);
  if (existsCpf) {
    return res.status(409).json({ message: "CPF ja cadastrado." });
  }

  const now = new Date().toISOString();
  const paciente: Paciente = {
    id: randomUUID(),
    nome: input.nome,
    telefone: input.telefone,
    email: input.email,
    cpf: formatCpf(input.cpf),
    dataCriacao: now,
    atualizadoEm: now,
  };

  data.pacientes.push(paciente);
  writeData(data);
  return res.status(201).json({ paciente });
});

pacientesRouter.put("/:id", (req: Request, res: Response) => {
  const id = String(req.params.id || "");
  const data = readData();
  const idx = data.pacientes.findIndex((p) => p.id === id);
  if (idx < 0) {
    return res.status(404).json({ message: "Paciente nao encontrado." });
  }

  const input = sanitizePacienteInput(req.body);
  if (!input.nome || !input.telefone || !input.email || !input.cpf) {
    return res.status(400).json({ message: "Nome, telefone, email e CPF sao obrigatorios." });
  }
  if (!isValidCpf(input.cpf)) {
    return res.status(400).json({ message: "CPF invalido." });
  }

  const cpfNorm = normalizeCpf(input.cpf);
  const existsCpf = data.pacientes.some((p, i) => i !== idx && normalizeCpf(p.cpf) === cpfNorm);
  if (existsCpf) {
    return res.status(409).json({ message: "CPF ja cadastrado para outro paciente." });
  }

  data.pacientes[idx] = {
    ...data.pacientes[idx],
    nome: input.nome,
    telefone: input.telefone,
    email: input.email,
    cpf: formatCpf(input.cpf),
    atualizadoEm: new Date().toISOString(),
  };

  writeData(data);
  return res.json({ paciente: data.pacientes[idx] });
});

pacientesRouter.get("/:id/agendamentos", (req: Request, res: Response) => {
  const id = String(req.params.id || "");
  const data = readData();
  const paciente = data.pacientes.find((p) => p.id === id);
  if (!paciente) {
    return res.status(404).json({ message: "Paciente nao encontrado." });
  }

  const agendamentos = data.agendamentos
    .filter((a) => a.pacienteId === id)
    .sort((a, b) => `${a.data}T${a.hora}`.localeCompare(`${b.data}T${b.hora}`))
    .map((a) => ({ ...a, paciente }));

  return res.json({ agendamentos });
});

pacientesRouter.get("/:key/prontuario", (req: Request, res: Response) => {
  const key = String(req.params.key || "");
  const data = readData();
  const resolved = resolvePacienteByKey(data, key);

  if (!resolved.paciente) {
    return res.status(404).json({ message: "Paciente nao encontrado." });
  }

  const prontuario = getOrCreateProntuarioByPacienteId(data, resolved.paciente.id);
  writeData(data);
  return res.json({
    prontuario,
    paciente: resolved.paciente,
    warning: resolved.deprecatedEmail ? "Endpoint por email esta depreciado; utilize patientId." : undefined,
  });
});

pacientesRouter.put("/:key/prontuario", (req: Request, res: Response) => {
  const key = String(req.params.key || "");
  const data = readData();
  const resolved = resolvePacienteByKey(data, key);
  if (!resolved.paciente) {
    return res.status(404).json({ message: "Paciente nao encontrado." });
  }

  const body = req.body || {};
  const idx = data.prontuarios.findIndex((p) => p.pacienteId === resolved.paciente!.id);
  const registros = Array.isArray(body.registros)
    ? body.registros
        .map((item: Partial<RegistroClinico>) => ({
          id: String(item.id || randomUUID()),
          data: String(item.data || toIsoDate(new Date())),
          tipo: String(item.tipo || "Observacao") as TipoRegistroClinico,
          descricao: String(item.descricao || ""),
        }))
        .filter((item: RegistroClinico) => item.descricao.trim())
    : [];

  const updated: ProntuarioPaciente = {
    pacienteId: resolved.paciente.id,
    observacoes: String(body.observacoes || ""),
    diagnosticos: String(body.diagnosticos || ""),
    examesRealizados: String(body.examesRealizados || ""),
    registros,
    atualizadoEm: new Date().toISOString(),
  };

  if (idx >= 0) {
    data.prontuarios[idx] = updated;
  } else {
    data.prontuarios.push(updated);
  }

  writeData(data);
  return res.json({
    prontuario: updated,
    paciente: resolved.paciente,
    warning: resolved.deprecatedEmail ? "Endpoint por email esta depreciado; utilize patientId." : undefined,
  });
});

export default pacientesRouter;
