# AgendaPro Consultorio - Documentacao Completa

Aplicacao full stack para gestao de agenda clinica, pacientes e prontuario, com autenticacao JWT e persistencia em arquivo JSON.

## 1. Objetivo

Centralizar operacao de consultorio em uma unica interface, permitindo:

- controlar agenda de atendimentos
- acompanhar status de execucao
- gerenciar cadastro de pacientes
- manter prontuario clinico por paciente
- visualizar indicadores operacionais em relatorio

## 2. Escopo funcional

A aplicacao entrega os seguintes modulos:

- Login com controle de sessao via JWT
- Relatorio operacional (hoje, ultimos/proximos periodos, intervalo personalizado)
- Novo agendamento (com paciente existente ou criacao inline)
- Agenda (calendario mensal, lista filtravel, CRUD e status)
- Pacientes (busca, listagem e acesso ao prontuario)
- Prontuario (dados clinicos, registros historicos e historico de agendamentos)
- Alternancia de tema claro/escuro

## 3. Visao de arquitetura

Arquitetura em 3 camadas:

- Frontend SPA: React + TypeScript + Vite + styled-components
- Backend API REST: Express + TypeScript
- Persistencia: arquivo JSON local (`data.json`)

Fluxo principal:

1. Frontend chama `/api/*` (proxy Vite em desenvolvimento)
2. Backend valida token JWT (exceto login)
3. Rotas leem/escrevem dados no arquivo JSON
4. Frontend atualiza estado com hooks por feature

## 4. Stack tecnica

- React 19
- TypeScript 5
- Vite 7
- Styled Components 6
- Express 5
- JWT (`jsonwebtoken`)
- Hash de senha com `bcryptjs`
- `tsx` para desenvolvimento da API
- `concurrently` para subir frontend e backend juntos

## 5. Requisitos

- Node.js 20+
- npm

## 6. Configuracao e execucao

### 6.1 Instalacao

```bash
npm install
```

### 6.2 Desenvolvimento

```bash
npm run dev
```

Servicos:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001`

### 6.3 Build

```bash
npm run build
```

### 6.4 Scripts disponiveis

- `npm run dev`: frontend + API em paralelo
- `npm run dev:web`: somente frontend
- `npm run dev:api`: somente API (watch)
- `npm run build`: build web + API
- `npm run build:web`: build do frontend
- `npm run build:api`: compilacao TypeScript da API
- `npm run preview`: preview do build frontend
- `npm run start:api`: executa API compilada (`server/dist`)
- `npm run typecheck`: validacao de tipos frontend e backend

## 7. Variaveis de ambiente

Configuracoes da API (`server/config.ts`):

- `PORT`: porta da API (default `3001`)
- `JWT_SECRET`: segredo do token (default `dev-secret-change-me`)
- `DATA_FILE`: caminho do arquivo de dados (default `./data.json`)
- `TOKEN_TTL`: tempo de expiracao do token (fixo em `8h`)
- `CURRENT_SEED_VERSION`: versao de schema/seed (atual `4`)

## 8. Estrutura de diretorios

```text
.
|-- src/
|   |-- app/                 # tipos, cliente API e utilitarios
|   |-- features/            # telas por dominio
|   |   |-- auth/
|   |   |-- agenda/
|   |   |-- agendamento/
|   |   |-- pacientes/
|   |   |-- relatorio/
|   |   `-- layout/
|   |-- hooks/               # hooks globais (auth e tema)
|   |-- styles/              # estilos globais por modulo
|   |-- App.tsx              # orquestracao principal da UI
|   `-- main.tsx             # bootstrap React
|-- server/
|   |-- routes/              # endpoints REST
|   |-- middleware/          # autenticacao
|   |-- services/            # regras de dominio
|   |-- data/                # persistencia, seed, migracao
|   |-- utils/               # utilitarios de formatacao/normalizacao
|   |-- app.ts               # instancia Express
|   |-- config.ts            # configuracoes
|   `-- index.ts             # bootstrap da API
|-- data.json                # banco local JSON (raiz)
|-- vite.config.ts           # proxy /api -> :3001
`-- README.md
```

## 9. Frontend em detalhes

### 9.1 Bootstrap

- `src/main.tsx` renderiza `App` e injeta `GlobalStyles`.

### 9.2 Composicao do `App`

`src/App.tsx` controla o estado de navegacao por `view`:

- `relatorio`
- `novo`
- `agenda`
- `pacientes`
- `paciente`

Hooks centrais:

- `useTheme`: alterna tema e persiste em `localStorage`
- `useAuth`: controla login/logout e validacao de sessao
- `usePacientes`: lista e busca de pacientes
- `useAgenda`: calendario, filtros, CRUD de agendamentos
- `useProntuario`: cadastro clinico e historico
- `useRelatorio`: metricas por periodo

### 9.3 Fluxo de autenticacao no frontend

1. Ao iniciar, `useAuth` verifica token em `localStorage` (`agenda.jwt`)
2. Se token existe, chama `GET /api/auth/me`
3. Se token invalido/expirado, remove token e retorna para login
4. Login envia `POST /api/auth/login` e salva token
5. Logout remove token local

### 9.4 Cliente HTTP

`src/app/api.ts`:

- adiciona `Content-Type: application/json`
- adiciona `Authorization: Bearer <token>` quando houver token
- faz parse de erro da API e lanca `Error(message)`

### 9.5 Features da interface

- `LoginView`: formulario de usuario/senha
- `Sidebar`: troca de modulo, alternancia de tema e logout
- `RelatorioView`: cards de KPI, pendencias, proximos atendimentos e distribuicao por categoria
- `AgendamentoFormView`: criacao/edicao de agendamento com escolha de paciente existente ou novo
- `AgendaView`: calendario mensal + lista filtrada + acoes (concluir, editar, excluir, abrir prontuario)
- `PacientesView`: busca e cards com resumo do paciente
- `PacienteView`: edicao cadastral, prontuario, registros clinicos e historico

### 9.6 Estilos e tema

- Estilos globais em `src/styles/GlobalStyles.ts` via composicao modular.
- Tokens CSS em `:root` e override em `[data-theme="dark"]`.
- Layout responsivo principal em `src/styles/responsive.ts`.

## 10. Backend em detalhes

### 10.1 Inicializacao

- `server/index.ts` inicia app e garante arquivo de dados com `ensureData()`.
- `server/app.ts` aplica `cors`, `express.json()` e registra rotas `/api/*`.

### 10.2 Middleware de autenticacao

`server/middleware/auth.ts`:

- exige header `Authorization: Bearer <token>`
- valida token com `JWT_SECRET`
- injeta payload em `req.user`
- retorna `401` para token ausente/invalido

### 10.3 Camada de dados

`server/data/store.ts`:

- `readData()`: leitura do JSON
- `writeData()`: escrita formatada
- `ensureData()`: cria seed inicial ou migra dados legados

### 10.4 Seed e migracao

`server/data/seed.ts`:

- cria usuarios padrao (`admin`, `isaac`) com senha em hash
- gera pacientes e agendamentos para popular ambiente
- migra estrutura legada de agendamentos para schema atual com paciente separado
- controla versao com `seedVersion`

## 11. Modelo de dados

### 11.1 UserRecord

```ts
type UserRecord = {
  username: string;
  passwordHash: string;
};
```

### 11.2 Paciente

```ts
type Paciente = {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  cpf: string;
  dataCriacao: string;
  atualizadoEm: string;
};
```

### 11.3 AgendamentoRecord

```ts
type AgendamentoRecord = {
  id: string;
  pacienteId: string;
  titulo: string;
  data: string;      // YYYY-MM-DD
  hora: string;      // HH:mm
  descricao: string;
  categoria: "Primeira consulta" | "Retorno" | "Exame" | "Procedimento";
  concluido: boolean;
  dataCriacao: string;
};
```

### 11.4 ProntuarioPaciente

```ts
type ProntuarioPaciente = {
  pacienteId: string;
  observacoes: string;
  diagnosticos: string;
  examesRealizados: string;
  registros: Array<{
    id: string;
    data: string;    // YYYY-MM-DD
    tipo: "Exame" | "Diagnostico" | "Evolucao" | "Conduta" | "Observacao";
    descricao: string;
  }>;
  atualizadoEm: string;
};
```

### 11.5 DataStore

```ts
type DataStore = {
  seedVersion: number;
  users: UserRecord[];
  pacientes: Paciente[];
  agendamentos: AgendamentoRecord[];
  prontuarios: ProntuarioPaciente[];
};
```

## 12. API REST - referencia completa

Base URL em desenvolvimento: `http://localhost:3001`

Observacao:

- `POST /api/auth/login` e publica
- demais endpoints exigem token JWT

### 12.1 Auth

#### POST `/api/auth/login`

Body:

```json
{
  "username": "admin",
  "password": "sua-senha"
}
```

Resposta 200:

```json
{
  "token": "<jwt>",
  "user": "admin"
}
```

Erros:

- `400`: usuario/senha ausentes
- `401`: credenciais invalidas

#### GET `/api/auth/me`

Header:

```text
Authorization: Bearer <jwt>
```

Resposta 200:

```json
{
  "user": "admin"
}
```

Erro:

- `401`: token ausente/invalido

### 12.2 Pacientes

#### GET `/api/pacientes`

Retorna lista ordenada por nome, com agregados:

- `totalAgendamentos`
- `ultimoAgendamento`

#### POST `/api/pacientes`

Body obrigatorio:

```json
{
  "nome": "Paciente",
  "telefone": "(11) 90000-0000",
  "email": "paciente@email.com",
  "cpf": "000.000.000-00"
}
```

Regras:

- todos os campos obrigatorios
- CPF precisa ser valido (11 digitos e nao repetido)
- CPF deve ser unico

#### PUT `/api/pacientes/:id`

Atualiza cadastro do paciente com mesmas validacoes de `POST`.

#### GET `/api/pacientes/:id/agendamentos`

Retorna historico de agendamentos do paciente (ordenado por data/hora).

#### GET `/api/pacientes/:key/prontuario`

Busca prontuario por:

- `id` (preferencial)
- `email` (legado, com warning de depreciacao)

Se nao existir prontuario, cria automaticamente um vazio.

#### PUT `/api/pacientes/:key/prontuario`

Salva prontuario completo para paciente identificado por `:key`.

### 12.3 Agendamentos

#### GET `/api/agendamentos`

Retorna lista ordenada por data/hora com objeto `paciente` expandido.

#### POST `/api/agendamentos`

Campos obrigatorios do agendamento:

- `titulo`
- `data`
- `hora`
- `categoria`

Pode receber:

- `pacienteId` (vincular paciente existente)
- `paciente` (objeto inline para criar paciente novo)

Exemplo com paciente existente:

```json
{
  "titulo": "Retorno de acompanhamento",
  "data": "2026-03-10",
  "hora": "14:00",
  "descricao": "Reavaliacao",
  "categoria": "Retorno",
  "pacienteId": "uuid-do-paciente"
}
```

Exemplo com paciente novo inline:

```json
{
  "titulo": "Consulta inicial",
  "data": "2026-03-10",
  "hora": "09:00",
  "descricao": "Primeira avaliacao",
  "categoria": "Primeira consulta",
  "paciente": {
    "nome": "Novo Paciente",
    "telefone": "(11) 91111-1111",
    "email": "novo@email.com",
    "cpf": "123.456.789-09"
  }
}
```

Validacoes:

- paciente inline exige nome, telefone, email e CPF
- CPF inline deve ser valido e unico
- deve existir paciente final valido para associacao

#### PUT `/api/agendamentos/:id`

Atualiza agendamento existente.

Regras:

- `id` e `dataCriacao` originais sao preservados
- `pacienteId` precisa apontar para paciente existente

Uso comum no frontend:

- editar dados do compromisso
- alternar `concluido` (concluir/reabrir)

#### DELETE `/api/agendamentos/:id`

Exclui agendamento.

Resposta:

- `204` sem corpo quando sucesso
- `404` se nao encontrado

## 13. Regras de negocio principais

- Ordenacao de agendamentos por `data + hora` em todas as listagens relevantes.
- Filtro de agenda por texto considera titulo, descricao, nome/email/telefone do paciente e categoria.
- Relatorio calcula:
  - totais no periodo selecionado
  - pendentes e concluidos
  - taxa de conclusao
  - atrasados (pendentes com data/hora menor que agora)
  - atendimentos de hoje
  - proximos 5 atendimentos
  - ate 5 pendencias criticas
  - distribuicao por categoria
- Prontuario permite remover registro localmente antes de salvar.
- Ao salvar cadastro do paciente, frontend recarrega pacientes e agendamentos.
- Ao criar/editar/excluir agendamento, frontend recarrega agenda e lista de pacientes.

## 14. Fluxos operacionais

### 14.1 Login

1. Usuario preenche credenciais
2. Frontend chama `/api/auth/login`
3. Token e salvo em `localStorage`
4. Requests seguintes enviam `Authorization: Bearer`

### 14.2 Criacao de agendamento

1. Usuario preenche dados da consulta
2. Escolhe paciente existente ou novo inline
3. Frontend envia `POST /api/agendamentos`
4. API valida e persiste
5. UI atualiza agenda e pacientes

### 14.3 Edicao e status

1. Usuario clica em "Editar" para carregar formulario
2. Salva via `PUT /api/agendamentos/:id`
3. Alternancia de status usa mesmo endpoint, alterando `concluido`

### 14.4 Prontuario

1. Usuario abre paciente via lista, agenda ou relatorio
2. Frontend busca prontuario e historico de agendamentos em paralelo
3. Usuario altera cadastro, campos clinicos e registros
4. Salva com `PUT /api/pacientes/:key/prontuario`

## 15. Persistencia e arquivo de dados

- Arquivo padrao: `data.json` na raiz do projeto.
- Pode ser alterado via `DATA_FILE`.
- Cada escrita substitui o arquivo inteiro (modelo simples para ambiente local/dev).
- Na inicializacao:
  - se arquivo nao existe: cria seed
  - se schema desatualizado: migra ou recria seed

## 16. Seguranca e consideracoes

- JWT com expiracao de 8h.
- Senhas armazenadas em hash bcrypt.
- CORS configurado com `origin: true` (flexivel para dev).
- Token salvo em `localStorage` (simples para SPA, sem protecao `httpOnly`).

## 17. Limites atuais

- Sem banco de dados relacional/noSQL (somente JSON local).
- Sem suite automatizada de testes.
- Sem controle de concorrencia em escrita de arquivo.
- Sem refresh token.
- Sem trilha de auditoria de alteracoes.

## 18. Guia rapido para manutencao

### 18.1 Adicionar novo campo em paciente

1. Atualizar tipos em `src/app/types.ts` e `server/types.ts`
2. Ajustar validacao em `server/services/paciente.ts`
3. Ajustar rotas `POST/PUT` de pacientes
4. Ajustar telas e hooks relacionados
5. Ajustar seed/migracao se necessario

### 18.2 Adicionar novo indicador no relatorio

1. Implementar calculo em `src/features/relatorio/useRelatorio.ts`
2. Expor no tipo `RelatorioResumo`
3. Renderizar em `src/features/relatorio/RelatorioView.tsx`

### 18.3 Trocar mecanismo de persistencia

1. Substituir `readData/writeData/ensureData` em `server/data/store.ts`
2. Manter contratos das rotas para evitar impacto no frontend

## 19. Arquivos-chave

Frontend:

- `src/App.tsx`
- `src/hooks/useAuth.ts`
- `src/features/agenda/useAgenda.tsx`
- `src/features/pacientes/useProntuario.ts`
- `src/features/relatorio/useRelatorio.ts`
- `src/app/api.ts`

Backend:

- `server/index.ts`
- `server/app.ts`
- `server/routes/auth.ts`
- `server/routes/pacientes.ts`
- `server/routes/agendamentos.ts`
- `server/middleware/auth.ts`
- `server/data/store.ts`
- `server/data/seed.ts`

## 20. Comandos uteis

Gerar hash bcrypt para senha manual:

```bash
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('nova-senha', 10))"
```

Validar tipos do projeto:

```bash
npm run typecheck
```

## 21. Resumo final

A aplicacao implementa um fluxo completo de operacao clinica para ambiente local/dev: autenticacao, agenda, pacientes, prontuario e relatorios, com arquitetura simples, modular e de facil evolucao.
