# AGENTS.md

## Visão geral
Sistema profissional de automação de YouTube com multi-provider, templates e pipeline de vídeo robusto.

## Entrypoint

- `node index.js` — sem flags de CLI. Primeira execução redireciona `/` para `/setup`.
- Encerra imediatamente se MongoDB não estiver disponível; sem fallback SQLite.
- Porta padrão: `3456` (variável de ambiente `PORT`).

## Comandos

- `npm start` / `npm run dev` (nodemon)
- `npm test` — executa `tests/run.js` com Node `assert`; requer MongoDB rodando.
- `npm run lint` — `eslint src/` (sem arquivo de configuração eslint no repositório).

## Quirks críticos

- `src/db/db.js` é 657 linhas de código SQLite morto — nunca importado.
- `src/middleware/security.js` e `src/middleware/compression.js` são definidos mas não utilizados; `index.js` usa pacotes `helmet()` e `compression()` diretamente.

## Arquitetura

- `index.js` monta middleware → DB → rotas → escuta.
- `src/routes/dashboard.js` recebe `(app, configService)` e monta todas as rotas API diretamente no app.
- `src/services/config.js` é a camada central de serviço/acesso a dados para todos os modelos Mongoose.
- Frontend é arquivos estáticos sob `dashboard/`.

## Convenções

- pt-BR em UI, docs, logs, alertas, comentários.
- Segredos de env apenas. `.env.example` é commitado; `.env` não é.
- Middleware de auth checa header `x-api-key`; se `API_KEY` não estiver definida, auth é bypassada.
- Middleware de validação espera `schema.safeParse()` (interface similar a zod).
- Limpeza é obrigatória entre fases; não restaure pastas/legacy removidas (`utils/`, `agents/`, `database/`, `setup.js`, `walkthrough.js`) ou modos removidos.

## Habilidades

- `.kilocode/skills/` contém habilidades repo-locais (orchestrator, frontend, security, etc.).