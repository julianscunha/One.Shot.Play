# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # run server (index.js), port 3456 by default
npm run dev             # nodemon, auto-reload
npm test                 # runs tests/run.js (plain assert scripts, no framework)
npm run lint              # eslint src/
npm run setup             # node index.js --setup
```

There is no per-test filter — `tests/run.js` is a hand-written script that calls
each `testX()` function in sequence (see the file for the list). To run just
one check, comment out the others or invoke the specific `testX()` function
via `node -e`.

## Architecture

Node.js/Express backend (CommonJS, no TypeScript, no frontend framework — served
statically from `src/dashboard`) automating an end-to-end YouTube video pipeline:
strategy → script → audio → images → video → captions → upload.

**Entry point:** `index.js` — calls `initializeDatabase()`, then mounts
`src/routes/*` under `/api` (execution, templates, schedule, logs, metrics,
config, analytics, costs) and `/setup` for first-run configuration.

**Database:** SQLite (`src/db/db.js`, path from `DATABASE_PATH` env var). The
project **migrated off MongoDB to SQLite** — `README.md` still describes the old
Mongo setup and is stale; trust the code/`.env.example` over the README for this.
`src/db/index.js` is a singleton initializer (`initializeDatabase`/`getDatabase`).

**Pipeline engine** (`src/services/pipeline/engine.js`): `PipelineEngine` drives
a fixed 7-phase state machine per execution (`estrategia`, `script`, `audio`,
`imagens`, `video`, `legenda`, `upload`), persisting phase status/progress
through `ConfigService` after every step, with retry/error classification via
`src/utils/retry.js` and `src/utils/errors.js` (`classifyError`, `isRetryable`).
`src/services/pipeline/worker.js` runs executions off the request cycle.

**ConfigService** (`src/services/config`) is the central hub — nearly every
route, service, and the pipeline engine goes through it for execution state,
logs, and system config. Treat it as the god object of this codebase; when
adding a new cross-cutting concern, it likely belongs here or is read from here.

**Multi-provider AI**: `CredentialManager` manages provider credentials
(OpenRouter, and others per `src/config/providers`); `AIVideoGenerator` drives
generation calls (OpenAI-style APIs) and assembles video as a local FFmpeg
slideshow (`runFFmpeg` in `src/utils` wraps ffmpeg; requires ffmpeg installed
on PATH). No cloud video-rendering provider is used.

**Verification**: `PreCheckService`/`PostCheckService`
(`src/services/verification`) validate before/after each generation step.

**Telegram bot** (`src/services/telegram`): `TelegramBotService` mirrors pipeline
status and accepts commands (`/status`, `/schedule`, `/publish`, `/cancel`,
`/logs`, `/config`) — treat it as a second control surface for the same
`ConfigService`/pipeline state the HTTP API uses, not a separate subsystem.

**Automation**: `DailyAutomation` (`src/workers`) triggers scheduled pipeline
runs; `CostService` enforces `CUSTO_LIMITE_DIARIO` (daily cost cap) across
providers.

**API auth**: routes require `API_KEY` (env var) for mutations; the frontend
fetches it same-origin via `GET /api/config/browser-key`. CORS, helmet, and
`express-rate-limit` are applied per-route (see `src/middleware`), not globally
for rate limiting — check the specific route file for its limiter before
assuming one applies.

## Notes

- All commit/log messages and in-app strings are Portuguese (pt-BR); match that
  convention in user-facing strings, logs, and Telegram bot copy.
- `data/` (assets, audio, captions, scripts, videos, thumbnails) and `logs/` are
  eslint-ignored generated output, not source.
- For files over ~200 lines, prefer `Grep` (to locate) plus `Read` with
  `offset`/`limit` (to fetch just that section) over reading the whole file —
  this repo's dashboard HTML files run 300-400+ lines and full reads burn
  context fast.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
