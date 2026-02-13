import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

type Categoria = "Primeira consulta" | "Retorno" | "Exame" | "Procedimento";

type UserRecord = {
  username: string;
  passwordHash: string;
};

type Agendamento = {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  descricao: string;
  clienteNome: string;
  clienteTelefone: string;
  clienteEmail: string;
  categoria: Categoria;
  concluido: boolean;
  dataCriacao: string;
};

type DataStore = {
  seedVersion: number;
  users: UserRecord[];
  agendamentos: Agendamento[];
};

type JwtPayload = {
  user: string;
  iat: number;
  exp: number;
};

type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};

const app = express();
const PORT = Number(process.env.PORT || 3001);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TOKEN_TTL = "8h";
const DATA_FILE = path.join(__dirname, "..", "data.json");
const CURRENT_SEED_VERSION = 3;

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function sanitizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z\s]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ".");
}

function makeEmail(name: string, i: number): string {
  const base = sanitizeName(name) || "cliente";
  const domains = ["email.com", "consultamail.com", "saude.app", "paciente.net"];
  return `${base}${i % 23}@${domains[i % domains.length]}`;
}

function makePhone(i: number): string {
  const prefix = 91000 + ((i * 137) % 8999);
  const suffix = String((1000 + (i * 73) % 9000)).padStart(4, "0");
  return `(11) ${prefix}-${suffix}`;
}

function makeRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function createLargeSampleAgendamentos(): Agendamento[] {
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
    "Luiza Mota", "Paulo Cezar", "Elisa Brito", "Thiago Aguiar", "Vanessa Peixoto", "Rodrigo Lemos"
  ];
  const slots = ["07:30", "08:20", "09:10", "10:00", "10:50", "11:40", "13:20", "14:10", "15:00", "15:50", "16:40", "17:30"];
  const tituloPorCategoria: Record<Categoria, string[]> = {
    "Primeira consulta": [
      "Consulta inicial", "Avaliacao clinica completa", "Triagem e anamnese", "Primeira consulta ambulatorial"
    ],
    "Retorno": [
      "Retorno de acompanhamento", "Reavaliacao de tratamento", "Revisao de conduta", "Retorno com orientacoes"
    ],
    "Exame": [
      "Solicitacao e revisao de exames", "Coleta de exames laboratoriais", "Exame de rotina", "Avaliacao de resultados"
    ],
    "Procedimento": [
      "Procedimento ambulatorial", "Pequeno procedimento", "Curativo e avaliacao", "Intervencao de suporte"
    ]
  };
  const descricaoPorCategoria: Record<Categoria, string[]> = {
    "Primeira consulta": [
      "Primeiro atendimento com levantamento do historico do paciente.",
      "Consulta com foco em queixa principal e planejamento inicial.",
      "Atendimento inicial para avaliacao geral e definicao de conduta."
    ],
    "Retorno": [
      "Retorno para acompanhar evolucao e ajuste de tratamento.",
      "Reavaliacao apos uso de medicacao e orientacoes anteriores.",
      "Consulta de acompanhamento com revisao de sintomas."
    ],
    "Exame": [
      "Atendimento para solicitar e interpretar exames clinicos.",
      "Consulta focada em exames de rotina e monitoramento.",
      "Revisao de resultados laboratoriais e proximos passos."
    ],
    "Procedimento": [
      "Procedimento de baixa complexidade realizado em consultorio.",
      "Sessao de procedimento com monitoramento e orientacoes finais.",
      "Atendimento tecnico com preparo e acompanhamento do paciente."
    ]
  };

  const rng = makeRng(2026);
  const list: Agendamento[] = [];
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
      const nomesIndex = (idx + i * 7) % names.length;
      const nome = names[nomesIndex];
      const tituloBase = tituloPorCategoria[categoria];
      const descBase = descricaoPorCategoria[categoria];
      const titulo = tituloBase[Math.floor(rng() * tituloBase.length)];
      const descricao = descBase[Math.floor(rng() * descBase.length)];
      const dataIso = toIsoDate(d);
      const concluido = dataIso < "2026-03-20" ? rng() > 0.15 : rng() > 0.9;

      list.push({
        id: randomUUID(),
        titulo,
        data: dataIso,
        hora: slots[slotIndex],
        descricao,
        clienteNome: nome,
        clienteTelefone: makePhone(idx + i + 1),
        clienteEmail: makeEmail(nome, idx + i + 1),
        categoria,
        concluido,
        dataCriacao: new Date(Date.UTC(2025, 11, 20 + ((idx + i) % 10), 10, 0, 0)).toISOString(),
      });
    }

    idx += 1;
  }

  return list.sort((a, b) => `${a.data}T${a.hora}`.localeCompare(`${b.data}T${b.hora}`));
}

function defaultUsers(): UserRecord[] {
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

function writeData(data: DataStore): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

function readData(): DataStore {
  ensureData();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as DataStore;
}

function ensureData(): void {
  if (!fs.existsSync(DATA_FILE)) {
    writeData({
      seedVersion: CURRENT_SEED_VERSION,
      users: defaultUsers(),
      agendamentos: createLargeSampleAgendamentos(),
    });
    return;
  }

  const existing = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as Partial<DataStore>;
  const users = Array.isArray(existing.users) && existing.users.length > 0 ? (existing.users as UserRecord[]) : defaultUsers();
  const version = Number(existing.seedVersion || 0);

  if (version < CURRENT_SEED_VERSION) {
    writeData({
      seedVersion: CURRENT_SEED_VERSION,
      users,
      agendamentos: createLargeSampleAgendamentos(),
    });
  }
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void {
  const auth = String(req.headers.authorization || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return res.status(401).json({ message: "Token ausente." });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Token invalido." });
  }
}

app.use(cors({ origin: true }));
app.use(express.json());

app.post("/api/auth/login", async (req: Request, res: Response) => {
  const username = String(req.body?.username || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!username || !password) {
    return res.status(400).json({ message: "Informe usuario e senha." });
  }

  const data = readData();
  const user = data.users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "Usuario ou senha invalidos." });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Usuario ou senha invalidos." });
  }

  const token = jwt.sign({ user: user.username }, JWT_SECRET, { expiresIn: TOKEN_TTL });
  return res.json({ token, user: user.username });
});

app.get("/api/auth/me", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ user: req.user?.user || "" });
});

app.get("/api/agendamentos", authMiddleware, (_req: Request, res: Response) => {
  const data = readData();
  return res.json({ agendamentos: data.agendamentos });
});

app.post("/api/agendamentos", authMiddleware, (req: Request, res: Response) => {
  const body = req.body || {};
  const required = [
    body.titulo,
    body.data,
    body.hora,
    body.clienteNome,
    body.clienteTelefone,
    body.clienteEmail,
    body.categoria,
  ];

  if (required.some((v) => !String(v || "").trim())) {
    return res.status(400).json({ message: "Campos obrigatorios ausentes." });
  }

  const data = readData();
  const item: Agendamento = {
    id: randomUUID(),
    titulo: String(body.titulo),
    data: String(body.data),
    hora: String(body.hora),
    descricao: String(body.descricao || ""),
    clienteNome: String(body.clienteNome),
    clienteTelefone: String(body.clienteTelefone),
    clienteEmail: String(body.clienteEmail).toLowerCase(),
    categoria: String(body.categoria) as Categoria,
    concluido: Boolean(body.concluido),
    dataCriacao: new Date().toISOString(),
  };

  data.agendamentos.push(item);
  writeData(data);
  return res.status(201).json({ agendamento: item });
});

app.put("/api/agendamentos/:id", authMiddleware, (req: Request, res: Response) => {
  const id = req.params.id;
  const data = readData();
  const index = data.agendamentos.findIndex((a) => a.id === id);
  if (index < 0) {
    return res.status(404).json({ message: "Agendamento nao encontrado." });
  }

  const current = data.agendamentos[index];
  const merged: Agendamento = {
    ...current,
    ...req.body,
    id: current.id,
    dataCriacao: current.dataCriacao,
  };

  data.agendamentos[index] = merged;
  writeData(data);
  return res.json({ agendamento: merged });
});

app.delete("/api/agendamentos/:id", authMiddleware, (req: Request, res: Response) => {
  const id = req.params.id;
  const data = readData();
  const before = data.agendamentos.length;
  data.agendamentos = data.agendamentos.filter((a) => a.id !== id);

  if (data.agendamentos.length === before) {
    return res.status(404).json({ message: "Agendamento nao encontrado." });
  }

  writeData(data);
  return res.status(204).send();
});

app.listen(PORT, () => {
  ensureData();
  console.log(`API rodando em http://localhost:${PORT}`);
});
