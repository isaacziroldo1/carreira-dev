import { randomUUID } from "node:crypto";
import { CURRENT_SEED_VERSION } from "../config";
import type {
  AgendamentoRecord,
  Categoria,
  DataStore,
  LegacyAgendamentoRecord,
  Paciente,
  UserRecord,
} from "../types";
import {
  formatCpf,
  normalizeCpf,
  normalizeEmail,
  sanitizeName,
  toIsoDate,
} from "../utils/format";

function makeEmail(name: string, i: number): string {
  const base = sanitizeName(name) || "paciente";
  const domains = ["email.com", "consultamail.com", "saude.app", "paciente.net"];
  return `${base}.${i % 31}@${domains[i % domains.length]}`;
}

function makePhone(i: number): string {
  const prefix = 91000 + ((i * 137) % 8999);
  const suffix = String((1000 + (i * 73) % 9000)).padStart(4, "0");
  return `(11) ${prefix}-${suffix}`;
}

function makeCpf(i: number): string {
  const base = String(10000000000 + ((i * 104729) % 89999999999)).slice(0, 11);
  return formatCpf(base);
}

function makeRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export function defaultUsers(): UserRecord[] {
  return [
    {
      username: "admin",
      passwordHash: "$2b$10$r3.9Kw7Dc72igIAsOf2gEek3CHT0qAD3aBb9vNSB65GaaoirY.bXq",
    },
    {
      username: "isaac",
      passwordHash: "$2b$10$kzqFM/9M1C1dc4A1e6K4IebpEGjsWhuQ76kkaNFbfqtQ4EC7399/y",
    },
  ];
}

export function buildSeedData(): Omit<DataStore, "users" | "seedVersion"> {
  const start = new Date("2026-01-01T00:00:00");
  const end = new Date("2026-05-31T00:00:00");
  const categories: Categoria[] = ["Primeira consulta", "Retorno", "Exame", "Procedimento"];
  const names = [
    "Mariana Souza", "Carlos Nunes", "Patricia Lima", "Roberto Alves", "Fernanda Costa", "Joao Mendes",
    "Renata Silva", "Bruno Rocha", "Helena Torres", "Mateus Araujo", "Camila Prado", "Rafael Duarte",
    "Isabela Freitas", "Diego Teixeira", "Amanda Moura", "Felipe Castro", "Larissa Ribeiro", "Tiago Barros",
    "Juliana Melo", "Ricardo Pires", "Aline Cardoso", "Gustavo Neves", "Beatriz Gomes", "Vinicius Santos",
    "Natasha Vieira", "Leandro Matos", "Priscila Carvalho", "Eduardo Tavares", "Monica Farias", "Lucas Antunes",
    "Nathalia Reis", "Andre Cunha", "Bianca Viana", "Caio Fonseca", "Daniela Azevedo", "Henrique Simas",
    "Tatiane Bueno", "Marcelo Aquino", "Sabrina Diniz", "Otavio Nogueira", "Karina Coelho", "Murilo Borges",
    "Luiza Mota", "Paulo Cezar", "Elisa Brito", "Thiago Aguiar", "Vanessa Peixoto", "Rodrigo Lemos",
  ];
  const slots = ["07:30", "08:20", "09:10", "10:00", "10:50", "11:40", "13:20", "14:10", "15:00", "15:50", "16:40", "17:30"];
  const tituloPorCategoria: Record<Categoria, string[]> = {
    "Primeira consulta": ["Consulta inicial", "Avaliacao clinica completa", "Triagem e anamnese", "Primeira consulta ambulatorial"],
    "Retorno": ["Retorno de acompanhamento", "Reavaliacao de tratamento", "Revisao de conduta", "Retorno com orientacoes"],
    "Exame": ["Solicitacao e revisao de exames", "Coleta de exames laboratoriais", "Exame de rotina", "Avaliacao de resultados"],
    "Procedimento": ["Procedimento ambulatorial", "Pequeno procedimento", "Curativo e avaliacao", "Intervencao de suporte"],
  };
  const descricaoPorCategoria: Record<Categoria, string[]> = {
    "Primeira consulta": [
      "Primeiro atendimento com levantamento do historico do paciente.",
      "Consulta com foco em queixa principal e planejamento inicial.",
      "Atendimento inicial para avaliacao geral e definicao de conduta.",
    ],
    "Retorno": [
      "Retorno para acompanhar evolucao e ajuste de tratamento.",
      "Reavaliacao apos uso de medicacao e orientacoes anteriores.",
      "Consulta de acompanhamento com revisao de sintomas.",
    ],
    "Exame": [
      "Atendimento para solicitar e interpretar exames clinicos.",
      "Consulta focada em exames de rotina e monitoramento.",
      "Revisao de resultados laboratoriais e proximos passos.",
    ],
    "Procedimento": [
      "Procedimento de baixa complexidade realizado em consultorio.",
      "Sessao de procedimento com monitoramento e orientacoes finais.",
      "Atendimento tecnico com preparo e acompanhamento do paciente.",
    ],
  };

  const pacientes: Paciente[] = names.map((nome, i) => {
    const now = new Date(Date.UTC(2025, 10, 10 + (i % 15), 10, 0, 0)).toISOString();
    return {
      id: randomUUID(),
      nome,
      telefone: makePhone(i + 1),
      email: makeEmail(nome, i + 1),
      cpf: makeCpf(i + 1),
      dataCriacao: now,
      atualizadoEm: now,
    };
  });

  const rng = makeRng(2026);
  const agendamentos: AgendamentoRecord[] = [];
  let idx = 0;

  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const weekday = d.getDay();
    if (weekday === 0) continue;

    const baseCount = weekday === 6 ? 2 : 4;
    const extra = rng() > 0.68 ? 1 : 0;
    const total = baseCount + extra;
    const usedSlots = new Set<number>();

    for (let i = 0; i < total; i += 1) {
      let slotIndex = Math.floor(rng() * slots.length);
      while (usedSlots.has(slotIndex)) {
        slotIndex = (slotIndex + 1) % slots.length;
      }
      usedSlots.add(slotIndex);

      const categoria = categories[Math.floor(rng() * categories.length)];
      const patientIndex = Math.floor(rng() * pacientes.length);
      const tituloBase = tituloPorCategoria[categoria];
      const descBase = descricaoPorCategoria[categoria];
      const dataIso = toIsoDate(d);

      agendamentos.push({
        id: randomUUID(),
        pacienteId: pacientes[patientIndex].id,
        titulo: tituloBase[Math.floor(rng() * tituloBase.length)],
        data: dataIso,
        hora: slots[slotIndex],
        descricao: descBase[Math.floor(rng() * descBase.length)],
        categoria,
        concluido: dataIso < "2026-03-20" ? rng() > 0.15 : rng() > 0.9,
        dataCriacao: new Date(Date.UTC(2025, 11, 20 + ((idx + i) % 10), 10, 0, 0)).toISOString(),
      });
    }

    idx += 1;
  }

  return {
    pacientes,
    agendamentos: agendamentos.sort((a, b) => `${a.data}T${a.hora}`.localeCompare(`${b.data}T${b.hora}`)),
    prontuarios: [],
  };
}

function isCategoria(value: string): value is Categoria {
  return value === "Primeira consulta" || value === "Retorno" || value === "Exame" || value === "Procedimento";
}

export function hasCurrentSchema(data: Partial<DataStore>): data is DataStore {
  if (!Array.isArray(data.users) || !Array.isArray(data.pacientes) || !Array.isArray(data.agendamentos) || !Array.isArray(data.prontuarios)) {
    return false;
  }
  return data.agendamentos.every(
    (ag) =>
      typeof (ag as Partial<AgendamentoRecord>).pacienteId === "string"
      && String((ag as Partial<AgendamentoRecord>).pacienteId || "").trim().length > 0,
  );
}

export function migrateLegacyData(existing: Partial<DataStore>, users: UserRecord[]): DataStore {
  const now = new Date().toISOString();
  const pacientes: Paciente[] = [];
  const byIdentity = new Map<string, Paciente>();
  const usedCpfs = new Set<string>();
  let fallbackCpfCounter = 1000;

  const nextCpf = (): string => {
    while (true) {
      const candidate = makeCpf(fallbackCpfCounter++);
      const norm = normalizeCpf(candidate);
      if (!usedCpfs.has(norm)) {
        usedCpfs.add(norm);
        return candidate;
      }
    }
  };

  const registerPaciente = (nomeRaw: string, telefoneRaw: string, emailRaw: string): Paciente => {
    const nome = String(nomeRaw || "").trim() || "Paciente sem nome";
    const telefone = String(telefoneRaw || "").trim() || "-";
    const emailNorm = normalizeEmail(emailRaw);
    const email = emailNorm || `${sanitizeName(nome) || "paciente"}.${pacientes.length + 1}@email.com`;
    const identity = sanitizeName(nome) || nome.toLowerCase();
    const existingPaciente = byIdentity.get(identity);
    if (existingPaciente) {
      if (existingPaciente.telefone === "-" && telefone !== "-") existingPaciente.telefone = telefone;
      if (!normalizeEmail(existingPaciente.email) && normalizeEmail(email)) existingPaciente.email = email;
      return existingPaciente;
    }
    const paciente: Paciente = {
      id: randomUUID(),
      nome,
      telefone,
      email,
      cpf: nextCpf(),
      dataCriacao: now,
      atualizadoEm: now,
    };
    pacientes.push(paciente);
    byIdentity.set(identity, paciente);
    return paciente;
  };

  const legacyAgendamentos = Array.isArray(existing.agendamentos) ? (existing.agendamentos as LegacyAgendamentoRecord[]) : [];
  const agendamentos: AgendamentoRecord[] = legacyAgendamentos.map((ag, idx) => {
    const paciente = registerPaciente(String(ag.clienteNome || ""), String(ag.clienteTelefone || ""), String(ag.clienteEmail || ""));
    const data = String(ag.data || "");
    const hora = String(ag.hora || "");
    const categoriaRaw = String(ag.categoria || "");
    return {
      id: String(ag.id || randomUUID()),
      pacienteId: paciente.id,
      titulo: String(ag.titulo || "Consulta"),
      data: /^\d{4}-\d{2}-\d{2}$/.test(data) ? data : toIsoDate(new Date()),
      hora: /^\d{2}:\d{2}$/.test(hora) ? hora : "09:00",
      descricao: String(ag.descricao || ""),
      categoria: isCategoria(categoriaRaw) ? categoriaRaw : "Retorno",
      concluido: Boolean(ag.concluido),
      dataCriacao: String(ag.dataCriacao || new Date(Date.UTC(2025, 0, 1 + (idx % 28), 10, 0, 0)).toISOString()),
    };
  });

  return {
    seedVersion: CURRENT_SEED_VERSION,
    users,
    pacientes,
    agendamentos: agendamentos.sort((a, b) => `${a.data}T${a.hora}`.localeCompare(`${b.data}T${b.hora}`)),
    prontuarios: [],
  };
}
