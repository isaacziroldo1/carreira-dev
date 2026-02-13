# AgendaPro Consultorio

Aplicacao full stack para gestao de agenda clinica, pacientes e prontuario, com autenticacao JWT e persistencia em arquivo JSON.

## Visao geral

O projeto combina:

- Frontend em React + Vite
- API REST em Express + TypeScript
- Persistencia local em `data.json`
- Autenticacao por token JWT

A interface principal e dividida em modulos de relatorio, novo agendamento, agenda, pacientes e prontuario.

## Principais funcionalidades

- Login com sessao autenticada via JWT
- Cadastro de agendamentos com paciente existente ou paciente novo inline
- Edicao, exclusao e marcacao de status (concluido/pendente) de agendamentos
- Calendario mensal com navegacao entre meses e destaque da data atual
- Filtros na agenda por texto, data e status
- Listagem e busca de pacientes por nome, email, telefone e CPF
- Edicao cadastral do paciente (nome, telefone, email, CPF)
- Prontuario com campos clinicos e registros historicos (Exame, Diagnostico, Evolucao, Conduta, Observacao)
- Relatorio com periodos pre-definidos e personalizado, incluindo:
  - total, pendentes, concluidos e taxa de conclusao
  - volume por categoria
  - pendencias criticas e proximos atendimentos
- Alternancia de tema light/dark com persistencia em `localStorage`

## Stack tecnica

- React 19
- TypeScript
- Vite
- Styled Components
- Express 5
- JSON Web Token (`jsonwebtoken`)
- `bcryptjs`

## Estrutura do projeto

- `src/`: frontend
- `server/`: API
- `data.json`: base local usada pela API

## Como executar

### Pre-requisitos

- Node.js 20+
- npm

### Instalacao

```bash
npm install
```

### Desenvolvimento (frontend + API)

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001`

## Scripts disponiveis

- `npm run dev`: sobe web e API em paralelo
- `npm run dev:web`: sobe apenas o frontend
- `npm run dev:api`: sobe apenas a API
- `npm run build`: build completo (web + API)
- `npm run build:web`: build do frontend
- `npm run build:api`: build da API
- `npm run preview`: preview do build web
- `npm run start:api`: executa API compilada
- `npm run typecheck`: checagem de tipos (frontend + server)

## Variaveis de ambiente da API

A API usa os seguintes valores (com default):

- `PORT` (default: `3001`)
- `JWT_SECRET` (default: `dev-secret-change-me`)
- `DATA_FILE` (default: `./data.json`)

## Dados e usuarios

- Na primeira execucao, a API cria/migra automaticamente o arquivo de dados.
- O seed inclui usuarios `admin` e `isaac` com senha armazenada como hash bcrypt.
- Para definir uma senha nova, gere um hash e atualize `users` no arquivo de dados:

```bash
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('sua-senha', 10))"
```

## Endpoints principais

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/agendamentos`
- `POST /api/agendamentos`
- `PUT /api/agendamentos/:id`
- `DELETE /api/agendamentos/:id`
- `GET /api/pacientes`
- `POST /api/pacientes`
- `PUT /api/pacientes/:id`
- `GET /api/pacientes/:id/agendamentos`
- `GET /api/pacientes/:key/prontuario`
- `PUT /api/pacientes/:key/prontuario`
