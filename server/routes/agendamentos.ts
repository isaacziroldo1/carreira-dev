import { randomUUID } from "node:crypto";
import { Router, type Request, type Response } from "express";
import { readData, writeData } from "../data/store";
import { authMiddleware } from "../middleware/auth";
import { expandAgendamento, sanitizePacienteInput } from "../services/paciente";
import type { AgendamentoRecord, Categoria, Paciente } from "../types";
import { formatCpf, isValidCpf, normalizeCpf } from "../utils/format";

const agendamentosRouter = Router();

agendamentosRouter.use(authMiddleware);

agendamentosRouter.get("/", (_req: Request, res: Response) => {
  const data = readData();
  const agendamentos = data.agendamentos
    .map((a) => expandAgendamento(a, data))
    .sort((a, b) => `${a.data}T${a.hora}`.localeCompare(`${b.data}T${b.hora}`));
  return res.json({ agendamentos });
});

agendamentosRouter.post("/", (req: Request, res: Response) => {
  const body = req.body || {};
  const requiredAgenda = [body.titulo, body.data, body.hora, body.categoria];
  if (requiredAgenda.some((v) => !String(v || "").trim())) {
    return res.status(400).json({ message: "Campos obrigatorios do agendamento ausentes." });
  }

  const data = readData();
  let pacienteId = String(body.pacienteId || "").trim();

  if (!pacienteId && body.paciente) {
    const p = sanitizePacienteInput(body.paciente);
    if (!p.nome || !p.telefone || !p.email || !p.cpf) {
      return res.status(400).json({ message: "Para criar paciente inline, informe nome, telefone, email e CPF." });
    }
    if (!isValidCpf(p.cpf)) {
      return res.status(400).json({ message: "CPF invalido para novo paciente." });
    }
    const cpfNorm = normalizeCpf(p.cpf);
    if (data.pacientes.some((x) => normalizeCpf(x.cpf) === cpfNorm)) {
      return res.status(409).json({ message: "CPF ja cadastrado. Selecione o paciente existente." });
    }

    const now = new Date().toISOString();
    const novoPaciente: Paciente = {
      id: randomUUID(),
      nome: p.nome,
      telefone: p.telefone,
      email: p.email,
      cpf: formatCpf(p.cpf),
      dataCriacao: now,
      atualizadoEm: now,
    };
    data.pacientes.push(novoPaciente);
    pacienteId = novoPaciente.id;
  }

  if (!pacienteId) {
    return res.status(400).json({ message: "Selecione um paciente existente ou crie um novo paciente." });
  }

  const paciente = data.pacientes.find((p) => p.id === pacienteId);
  if (!paciente) {
    return res.status(400).json({ message: "Paciente nao encontrado." });
  }

  const item: AgendamentoRecord = {
    id: randomUUID(),
    pacienteId,
    titulo: String(body.titulo),
    data: String(body.data),
    hora: String(body.hora),
    descricao: String(body.descricao || ""),
    categoria: String(body.categoria) as Categoria,
    concluido: Boolean(body.concluido),
    dataCriacao: new Date().toISOString(),
  };

  data.agendamentos.push(item);
  writeData(data);
  return res.status(201).json({ agendamento: { ...item, paciente } });
});

agendamentosRouter.put("/:id", (req: Request, res: Response) => {
  const id = String(req.params.id || "");
  const data = readData();
  const index = data.agendamentos.findIndex((a) => a.id === id);
  if (index < 0) {
    return res.status(404).json({ message: "Agendamento nao encontrado." });
  }

  const current = data.agendamentos[index];
  const incomingPacienteId = String(req.body?.pacienteId || current.pacienteId).trim();
  const paciente = data.pacientes.find((p) => p.id === incomingPacienteId);
  if (!paciente) {
    return res.status(400).json({ message: "Paciente do agendamento nao encontrado." });
  }

  const merged: AgendamentoRecord = {
    ...current,
    ...req.body,
    id: current.id,
    dataCriacao: current.dataCriacao,
    pacienteId: incomingPacienteId,
  };

  data.agendamentos[index] = merged;
  writeData(data);
  return res.json({ agendamento: { ...merged, paciente } });
});

agendamentosRouter.delete("/:id", (req: Request, res: Response) => {
  const id = String(req.params.id || "");
  const data = readData();
  const before = data.agendamentos.length;
  data.agendamentos = data.agendamentos.filter((a) => a.id !== id);

  if (data.agendamentos.length === before) {
    return res.status(404).json({ message: "Agendamento nao encontrado." });
  }

  writeData(data);
  return res.status(204).send();
});

export default agendamentosRouter;
