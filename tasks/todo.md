# Task List: Refatoração Completa do YouTube Automation Agent

**Regras transversais:**
- **Idioma:** pt-BR em toda interface, documentação, alertas e interações
- **Limpeza:** A cada fase, remover código morto, arquivos não usados, dependências órfãs
- **Otimização:** A cada 2 fases, rodar PonyTail e aplicar sugestões

## Fase 0: Infraestrutura e Setup

- [ ] Task 0.1: Reestruturar pastas do projeto (src/, routes/, services/, etc.)
  - Acceptance: Estrutura de pastas reorganizada, imports atualizados
  - Verify: `node index.js` sem erros de módulo
  - Files: `index.js`, pastas do projeto
  - Scope: M (5+ arquivos)

- [ ] Task 0.2: Criar entrypoint único (`index.js`) sem modos/flags
  - Acceptance: App sobe com `node index.js`, sem flags, sem modos
  - Verify: `node index.js` → servidor na porta configurada
  - Files: `index.js`
  - Scope: S

- [ ] Task 0.3: Implementar detecção de primeira execução e redirect para `/setup`
  - Acceptance: Primeira execução redireciona para `/setup`, após setup vai para `/`
  - Verify: Acessar `/` antes do setup → redirect para `/setup`
  - Files: `index.js`, `routes/setup.js`
  - Scope: S

- [ ] Task 0.4: Configurar conexão MongoDB (Back4App)
  - Acceptance: App conecta ao MongoDB do Back4App
  - Verify: Health check retorna DB conectado
  - Files: `db/mongodb.js`
  - Scope: S

- [ ] Task 0.5: Criar modelos base do banco (Config, Template, Schedule, Execution, Log)
  - Acceptance: Modelos criados com índices e validações
  - Verify: Collections criadas no MongoDB
  - Files: `db/models/*.js`
  - Scope: M

- [ ] Task 0.6: Configurar variáveis de ambiente mínimas no Back4App
  - Acceptance: App funciona com apenas 2 variáveis (OPENROUTER_API_KEY, TELEGRAM_BOT_TOKEN)
  - Verify: Deploy no Back4App funciona
  - Files: `.env.example`, docs
  - Scope: S

- [ ] Task 0.7: Deploy inicial no Back4App (health check básico)
  - Acceptance: App deployado e respondendo no Back4App
  - Verify: GET /health retorna 200
  - Files: Deploy config
  - Scope: S

## Checkpoint: Fase 0
- [ ] App sobe no Back4App
- [ ] Banco conecta
- [ ] `/setup` acessível
- [ ] Sem flags ou modos

**Limpeza:**
- [ ] Remover `walkthrough.js`, `setup.js` interativo antigo, modos legados
- [ ] Remover dependências não usadas
- [ ] Remover arquivos de configuração legados

---

## Fase 1: Sistema de Configuração e Templates

- [ ] Task 1.1: Criar tabela de configuração no banco (estrutura flexível)
  - Acceptance: Configurações armazenadas e recuperadas do banco
  - Verify: POST /api/config → GET /api/config retorna dados
  - Files: `db/models/Config.js`, `routes/config.js`
  - Scope: M

- [ ] Task 1.2: Implementar `/settings` com abas (Providers, Canal, Idioma, Segurança)
  - Acceptance: Interface de configuração com todas as abas funcionais
  - Verify: Navegar por `/settings` → todas as abas carregam
  - Files: `dashboard/settings.html`, `routes/config.js`
  - Scope: M

- [ ] Task 1.3: Criar modelo de Provider com primary + fallback + timeout
  - Acceptance: Provider armazena 2 endpoints com timeout configurável
  - Verify: Criar provider com 2 endpoints → salva corretamente
  - Files: `db/models/Provider.js`
  - Scope: S

- [ ] Task 1.4: Implementar lógica de fallback automático por provider
  - Acceptance: Se primary falha/timeout, usa fallback automaticamente
  - Verify: Simular falha no primary → fallback é chamado
  - Files: `services/ai/ai-service.js`
  - Scope: M

- [ ] Task 1.5: Criar CRUD de Templates (`/templates`)
  - Acceptance: Criar, editar, excluir, listar templates
  - Verify: CRUD completo via API e interface
  - Files: `db/models/Template.js`, `routes/templates.js`, `dashboard/templates.html`
  - Scope: M

- [ ] Task 1.6: Implementar templates pré-definidos (Infantil, Educacional, Musical, Cartoon)
  - Acceptance: 4 templates pré-definidos disponíveis
  - Verify: Templates aparecem na lista após setup
  - Files: `db/seeders/templates.js`
  - Scope: S

- [ ] Task 1.7: Adicionar validação de conexão por provider antes de salvar
  - Acceptance: Teste de conexão executado antes de salvar configuração
  - Verify: Salvar provider → teste de conexão executado
  - Files: `routes/config.js`, `services/*/provider-service.js`
  - Scope: M

- [ ] Task 1.8: Implementar criptografia/armazenamento seguro de secrets
  - Acceptance: Secrets não aparecem em logs nem em responses da API
  - Verify: GET /api/config → secrets mascarados ou ausentes
  - Files: `utils/secrets.js`, `middleware/errorHandler.js`
  - Scope: S

## Checkpoint: Fase 1
- [ ] Configuração completa via web
- [ ] Multi-provider com fallback funcionando
- [ ] Templates CRUD completo
- [ ] Secrets protegidos

**Limpeza:**
- [ ] Remover `config/credentials.json`, `utils/credential-manager.js` legado
- [ ] Remover `walkthrough.js`, `setup.js` interativo antigo
- [ ] Remover dependências não usadas (inquirer, chalk, etc.)

---

## Fase 2: Pipeline de Vídeo e Retry por Fase

- [ ] Task 2.1: Definir fases do pipeline (Estratégia → Script → Áudio → Imagens → Vídeo → Legenda → Upload)
  - Acceptance: Pipeline documentado com fases claras
  - Verify: Documentação atualizada
  - Files: `services/pipeline/README.md`
  - Scope: S

- [ ] Task 2.2: Criar engine de pipeline com estado e checkpoint por fase
  - Acceptance: Pipeline salva estado após cada fase concluída
  - Verify: Executar pipeline → interromper → retomar do checkpoint
  - Files: `services/pipeline/engine.js`, `db/models/Execution.js`
  - Scope: L

- [ ] Task 2.3: Implementar retry exponencial por fase (10s/20s/40s... até 10min)
  - Acceptance: Retry com backoff exponencial por fase
  - Verify: Simular falha → retries com intervalos corretos
  - Files: `utils/retry.js`, `services/pipeline/engine.js`
  - Scope: M

- [ ] Task 2.4: Implementar classificação de erros (TRANSIENT vs FATAL)
  - Acceptance: Erros classificados corretamente
  - Verify: TRANSIENT → retry, FATAL → aborta e alerta
  - Files: `utils/errors.js`
  - Scope: S

- [ ] Task 2.5: Criar sistema de verificação pré-execução
  - Acceptance: Verificações executadas antes de iniciar pipeline
  - Verify: Pré-execução bloqueia se conta YouTube com restrição
  - Files: `services/verification/pre-check.js`
  - Scope: M

- [ ] Task 2.6: Implementar verificação pós-criação (alucinações visuais)
  - Acceptance: Análise de imagens detecta anomalias
  - Verify: Imagem com anomalia → aborta e reinicia
  - Files: `services/verification/post-check.js`
  - Scope: M

- [ ] Task 2.7: Criar worker de execução isolado
  - Acceptance: Worker processa execuções em fila
  - Verify: Múltiplas execuções processadas em paralelo
  - Files: `workers/executor.js`
  - Scope: M

- [ ] Task 2.8: Implementar cancelamento de execução
  - Acceptance: Execução pode ser cancelada a qualquer momento
  - Verify: Cancelar execução → worker para gracefully
  - Files: `workers/executor.js`, `routes/execution.js`
  - Scope: M

## Checkpoint: Fase 2
- [ ] Pipeline executa vídeo completo
- [ ] Retry por fase funciona
- [ ] Verificação pré/pós ativa
- [ ] Cancelamento funcional

**Limpeza:**
- [ ] Remover agents antigos (`agents/*.js`) substituídos por services
- [ ] Remover `database/db.js` legado (SQLite)
- [ ] Remover dependências SQLite/nedb
- [ ] Remover modos de inicialização antigos

**PonyTail (1ª rodada - Fase 2/9):**
- [ ] Rodar análise do PonyTail no repositório
- [ ] Aplicar sugestões de otimização
- [ ] Documentar melhorias no `docs/PERF-BENCHMARK.md`

---

## Fase 3: Interface Web e Dashboard

- [ ] Task 3.1: Redesenhar layout do dashboard (estilo empresarial)
  - Acceptance: Dashboard com design limpo, profissional
  - Verify: Visual aprovado pelo usuário
  - Files: `dashboard/index.html`, `dashboard/styles.css`
  - Scope: M

- [ ] Task 3.2: Implementar health check real por serviço
  - Acceptance: Health check reflete status real de cada serviço
  - Verify: Parar um serviço → dashboard reflete como offline
  - Files: `routes/health.js`, `dashboard/index.html`
  - Scope: M

- [ ] Task 3.3: Criar tela de status de APIs (online/offline/degraded)
  - Acceptance: Cada API mostrada com status visual
  - Verify: API primary offline → mostra degraded, fallback online
  - Files: `dashboard/api-status.html`, `routes/health.js`
  - Scope: S

- [ ] Task 3.4: Implementar contadores reais de publicações (do banco)
  - Acceptance: Contadores vindos do banco, não hardcoded
  - Verify: Publicar 1 vídeo → contador atualiza
  - Files: `routes/dashboard.js`, `dashboard/index.html`
  - Scope: S

- [ ] Task 3.5: Criar tela de agendamentos (lista, edição, exclusão)
  - Acceptance: CRUD de agendamentos funcional
  - Verify: Criar, editar, excluir agendamento via interface
  - Files: `dashboard/schedule.html`, `routes/schedule.js`
  - Scope: M

- [ ] Task 3.6: Implementar barra de progresso detalhada para execução manual
  - Acceptance: Barra mostra progresso por fase
  - Verify: Executar manualmente → barra atualiza em tempo real
  - Files: `dashboard/execute.html`, `routes/execution.js`
  - Scope: M

- [ ] Task 3.7: Criar tela de logs em tempo real com filtros
  - Acceptance: Logs filtrados por nível, data, serviço
  - Verify: Filtrar logs → apenas os selecionados aparecem
  - Files: `dashboard/logs.html`, `routes/logs.js`
  - Scope: M

- [ ] Task 3.8: Implementar painel de métricas (sucesso/falha, taxa)
  - Acceptance: Métricas calculadas dinamicamente
  - Verify: Taxa de sucesso = publicações_ok / total
  - Files: `routes/metrics.js`, `dashboard/metrics.html`
  - Scope: S

- [ ] Task 3.9: Adicionar cancelamento de agendamento
  - Acceptance: Agendamento pode ser cancelado
  - Verify: Cancelar agendamento → não executa mais
  - Files: `routes/schedule.js`, `dashboard/schedule.html`
  - Scope: S

## Checkpoint: Fase 3
- [ ] Dashboard profissional
- [ ] Dados reais (não mockados)
- [ ] Logs, métricas, progress bar funcionais
- [ ] Agendamentos editáveis

**Limpeza:**
- [ ] Remover código legado de dashboard antigo
- [ ] Remover rotas e endpoints não utilizados

---

## Fase 4: Telegram Bot

- [ ] Task 4.1: Criar bot do Telegram e configurar webhook/polling
  - Acceptance: Bot responde a comandos
  - Verify: Enviar `/start` → bot responde
  - Files: `services/telegram/bot.js`
  - Scope: S

- [ ] Task 4.2: Implementar autenticação de usuários no bot
  - Acceptance: Apenas usuários autorizados interagem
  - Verify: Usuário não autorizado → acesso negado
  - Files: `services/telegram/auth.js`
  - Scope: S

- [ ] Task 4.3: Implementar comandos básicos (`/status`, `/schedule`, `/cancel`, `/logs`)
  - Acceptance: Todos os comandos respondem com dados reais
  - Verify: Cada comando retorna informação correta
  - Files: `services/telegram/commands.js`
  - Scope: M

- [ ] Task 4.4: Criar questionário interativo para publicação (`/publish`)
  - Acceptance: Questionário sequencial funciona (tema → público → canal → template)
  - Verify: `/publish` → bot pergunta cada item → publica ao final
  - Files: `services/telegram/publish-flow.js`
  - Scope: M

- [ ] Task 4.5: Implementar notificações de execução (sucesso/falha)
  - Acceptance: Notificações enviadas após cada execução
  - Verify: Executar publicação → bot envia report
  - Files: `services/telegram/notifications.js`
  - Scope: S

- [ ] Task 4.6: Adicionar alertas de custo e indisponibilidade
  - Acceptance: Alertas enviados ao atingir limite ou serviço cair
  - Verify: Simular falha de serviço → alerta no Telegram
  - Files: `services/telegram/alerts.js`
  - Scope: S

- [ ] Task 4.7: Implementar comando `/config` para alterar configurações
  - Acceptance: Usuário pode alterar config básica via Telegram
  - Verify: `/config template default` → template alterado
  - Files: `services/telegram/config.js`
  - Scope: S

## Checkpoint: Fase 4
- [ ] Bot funcional com todos os comandos
- [ ] Questionário interativo funciona
- [ ] Notificações e alertas ativos

**Limpeza:**
- [ ] Remover código legado de dashboard antigo
- [ ] Remover rotas e endpoints não utilizados

**PonyTail (2ª rodada - Fase 4/9):**
- [ ] Rodar análise do PonyTail no repositório
- [ ] Aplicar sugestões de otimização
- [ ] Documentar melhorias

---

## Fase 5: Sistema de Custo e Métricas

- [ ] Task 5.1: Implementar cálculo de custo por provider e por fase
  - Acceptance: Custo calculado antes de cada execução
  - Verify: Custo estimado exibido antes de publicar
  - Files: `utils/cost.js`, `services/pipeline/engine.js`
  - Scope: M

- [ ] Task 5.2: Criar sistema de limites (diário/semanal)
  - Acceptance: Limites configuráveis por período
  - Verify: Atingir limite → bloqueia novas execuções
  - Files: `utils/cost.js`, `routes/config.js`
  - Scope: M

- [ ] Task 5.3: Implementar bloqueio automático ao atingir limite
  - Acceptance: Sistema bloqueia execuções ao atingir limite
  - Verify: Limite atingido → botão de publicar desabilitado
  - Files: `middleware/costGuard.js`
  - Scope: S

- [ ] Task 5.4: Criar alertas em 80% e 100% do limite (painel + Telegram)
  - Acceptance: Alertas enviados nos dois thresholds
  - Verify: Simular 80% de uso → alerta enviado
  - Files: `services/telegram/alerts.js`, `routes/config.js`
  - Scope: S

- [ ] Task 5.5: Implementar histórico de custos
  - Acceptance: Histórico disponível no dashboard
  - Verify: Histórico mostra gastos por dia/semana/mês
  - Files: `db/models/CostLog.js`, `routes/metrics.js`
  - Scope: S

- [ ] Task 5.6: Criar painel de métricas do YouTube (views, watch time, estimativa ganhos)
  - Acceptance: Métricas reais do YouTube exibidas
  - Verify: Conectar YouTube Analytics → dados aparecem
  - Files: `services/youtube/analytics.js`, `dashboard/metrics.html`
  - Scope: M

- [ ] Task 5.7: Implementar análise de mercado (trends)
  - Acceptance: Sistema identifica tipos de vídeo em alta
  - Verify: Análise retorna categorias trending
  - Files: `services/analytics/market-analysis.js`
  - Scope: M

- [ ] Task 5.8: Criar sistema de sugestão de templates baseado em trends
  - Acceptance: Sugestão exibida com justificativa
  - Verify: Aplicar sugestão → template atualizado
  - Files: `services/analytics/suggestions.js`, `dashboard/suggestions.html`
  - Scope: M

## Checkpoint: Fase 5
- [ ] Custo calculado e limitado
- [ ] Alertas ativos
- [ ] Métricas do YouTube exibidas
- [ ] Análise de mercado e sugestões funcionando

**Limpeza:**
- [ ] Remover código morto de agents antigos
- [ ] Remover dependências não utilizadas

---

## Fase 6: Otimização e Performance

- [ ] Task 6.1: Auditar código para identificar desperdício de tokens
  - Acceptance: Auditoria documentada com pontos de otimização
  - Verify: Documento com pelo menos 10 pontos identificados
  - Files: `docs/AUDIT-2026.md`
  - Scope: S

- [ ] Task 6.2: Implementar cache de respostas de IA
  - Acceptance: Cache reduz chamadas repetidas à API
  - Verify: Mesma pergunta 2x → segunda vez vem do cache
  - Files: `services/ai/cache.js`
  - Scope: M

- [ ] Task 6.3: Implementar pool de conexões HTTP
  - Acceptance: Conexões reutilizadas, não criadas a cada request
  - Verify: Logs mostram conexões reutilizadas
  - Files: `utils/http-pool.js`
  - Scope: S

- [ ] Task 6.4: Adicionar compressão de payloads
  - Acceptance: Payloads comprimidos em trânsito
  - Verify: Headers Content-Encoding: gzip presentes
  - Files: `index.js`, `middleware/compression.js`
  - Scope: S

- [ ] Task 6.5: Implementar reuso de assets (imagens, áudios)
  - Acceptance: Assets reutilizados quando possível
  - Verify: Mesmo asset usado em múltiplos vídeos
  - Files: `services/media/asset-manager.js`
  - Scope: M

- [ ] Task 6.6: Remover código morto e dependências não usadas
  - Acceptance: `npm prune` não remove nada, bundle enxuto
  - Verify: `npm ls` sem dependências órfãs
  - Files: `package.json`, código
  - Scope: M

- [ ] Task 6.7: Implementar sistema de memória (histórico de execuções, reuso)
  - Acceptance: Sistema aprende com execuções anteriores
  - Verify: Reutiliza assets quando relevante
  - Files: `services/memory/memory.js`, `db/models/Memory.js`
  - Scope: M

- [ ] Task 6.8: Medir e documentar before/after de performance
  - Acceptance: Documento com medições antes/depois
  - Verify: Relatório com números concretos
  - Files: `docs/PERF-BENCHMARK.md`
  - Scope: S

## Checkpoint: Fase 6
- [ ] Código limpo e otimizado
- [ ] Cache ativo
- [ ] Medição de melhoria documentada
- [ ] Sistema de memória funcionando

**Limpeza:**
- [ ] Remover código morto restante
- [ ] Remover dependências não usadas

**PonyTail (3ª rodada - Fase 6/9):**
- [ ] Rodar análise do PonyTail no repositório
- [ ] Aplicar sugestões de otimização
- [ ] Documentar melhorias

---

## Fase 7: Segurança e Hardening

- [ ] Task 7.1: Configurar Helmet.js com headers de segurança
  - Acceptance: Headers de segurança presentes em todas as responses
  - Verify: curl -I mostra CSP, HSTS, X-Frame-Options, etc.
  - Files: `index.js`, `middleware/security.js`
  - Scope: S

- [ ] Task 7.2: Implementar rate limiting em todas as rotas
  - Acceptance: Rate limiting ativo em todas as rotas
  - Verify: 100 requests em 15min → 429 retornado
  - Files: `middleware/rateLimit.js`
  - Scope: S

- [ ] Task 7.3: Implementar autenticação por API key para rotas mutantes
  - Acceptance: Rotas POST/PATCH/DELETE requerem API key
  - Verify: Request sem API key → 401
  - Files: `middleware/auth.js`, `routes/*.js`
  - Scope: M

- [ ] Task 7.4: Adicionar validação de input em todas as boundaries
  - Acceptance: Todos os inputs validados antes de processar
  - Verify: Input inválido → 422 com detalhes
  - Files: `middleware/validation.js`, `routes/*.js`
  - Scope: M

- [ ] Task 7.5: Implementar sanitização de dados de usuário
  - Acceptance: Dados de usuário sanitizados antes de armazenar/exibir
  - Verify: XSS payload → sanitizado
  - Files: `utils/sanitize.js`
  - Scope: S

- [ ] Task 7.6: Revisar logs para remover secrets/PII
  - Acceptance: Nenhum secret ou PII em logs
  - Verify: Grep por "password", "token", "key" nos logs → 0 resultados
  - Files: `utils/logger.js`, todos os arquivos que usam logger
  - Scope: M

- [ ] Task 7.7: Configurar CORS restrito
  - Acceptance: CORS apenas para origens conhecidas
  - Verify: Request de origem não permitida → bloqueada
  - Files: `index.js`, `middleware/cors.js`
  - Scope: S

- [ ] Task 7.8: Implementar auditoria de segurança (OWASP Top 10)
  - Acceptance: Checklist OWASP completo documentado
  - Verify: Documento com todos os checks
  - Files: `docs/SECURITY-AUDIT.md`
  - Scope: S

## Checkpoint: Fase 7
- [ ] Helmet configurado
- [ ] Rate limiting ativo
- [ ] API key obrigatória
- [ ] Input validado
- [ ] Sem secrets em logs
- [ ] CORS restrito
- [ ] Auditoria documentada

**Limpeza:**
- [ ] Remover código legado de segurança antiga
- [ ] Remover dependências de segurança não usadas

---

## Fase 8: Testes e Validação Final

- [ ] Task 8.1: Escrever testes de integração para pipeline de vídeo
  - Acceptance: Pipeline testado end-to-end
  - Verify: `npm test` → testes de pipeline passam
  - Files: `tests/pipeline.test.js`
  - Scope: M

- [ ] Task 8.2: Escrever testes para retry por fase
  - Acceptance: Retry testado com falhas simuladas
  - Verify: Teste falha → retry executado
  - Files: `tests/retry.test.js`
  - Scope: S

- [ ] Task 8.3: Escrever testes para sistema de custo
  - Acceptance: Cálculo de custo testado
  - Verify: Testes de limite e bloqueio passam
  - Files: `tests/cost.test.js`
  - Scope: S

- [ ] Task 8.4: Escrever testes para Telegram bot
  - Acceptance: Comandos do bot testados
  - Verify: Testes de comandos passam
  - Files: `tests/telegram.test.js`
  - Scope: M

- [ ] Task 8.5: Testar multi-provider com fallback
  - Acceptance: Fallback testado em cenários de falha
  - Verify: Primary falha → fallback assume
  - Files: `tests/providers.test.js`
  - Scope: M

- [ ] Task 8.6: Testar todos os templates
  - Acceptance: Cada template executa pipeline completo
  - Verify: 4 templates testados, todos passam
  - Files: `tests/templates.test.js`
  - Scope: M

- [ ] Task 8.7: Testar deploy completo no Back4App
  - Acceptance: Deploy funciona com todas as features
  - Verify: Smoke test completo no Back4App
  - Files: Deploy
  - Scope: S

- [ ] Task 8.8: Validar critérios de aceite da spec
  - Acceptance: Todos os 16 itens da spec atendidos
  - Verify: Checklist da spec completo
  - Files: `docs/SPEC-REFATOR-2026.md`
  - Scope: S

## Checkpoint: Fase 8
- [ ] Todos os testes passam
- [ ] Deploy validado
- [ ] Critérios de aceite atendidos

**Limpeza:**
- [ ] Remover testes de funcionalidades removidas
- [ ] Remover mocks e fixtures não utilizados

**PonyTail (4ª rodada - Fase 8/9 - Final):**
- [ ] Rodar análise final do PonyTail
- [ ] Aplicar sugestões finais de otimização
- [ ] Documentar relatório completo

---

## Fase 9: Deploy e Documentação

- [ ] Task 9.1: Configurar CI/CD (GitHub Actions)
  - Acceptance: Pipeline CI/CD funcional
  - Verify: Push → lint → test → build → deploy automático
  - Files: `.github/workflows/ci.yml`
  - Scope: M

- [ ] Task 9.2: Escrever README completo
  - Acceptance: README com setup, uso, arquitetura
  - Verify: README cobre todos os tópicos
  - Files: `README.md`
  - Scope: S

- [ ] Task 9.3: Documentar arquitetura (ADR)
  - Acceptance: ADRs para decisões arquiteturais
  - Verify: Pelo menos 5 ADRs escritos
  - Files: `docs/adr/*.md`
  - Scope: S

- [ ] Task 9.4: Criar guia de uso para o usuário
  - Acceptance: Guia passo-a-passo para usar o sistema
  - Verify: Guia cobre setup, configuração, publicação, troubleshooting
  - Files: `docs/USER-GUIDE.md`
  - Scope: S

- [ ] Task 9.5: Deploy final no Back4App
  - Acceptance: Sistema em produção no Back4App
  - Verify: URL do Back4App funcional
  - Files: Deploy
  - Scope: S

- [ ] Task 9.6: Monitoramento pós-deploy (primeira semana)
  - Acceptance: Monitoramento ativo por 7 dias
  - Verify: Logs e métricas sendo coletados
  - Files: Monitoramento
  - Scope: S

## Checkpoint: Fase 9
- [ ] CI/CD configurado
- [ ] Documentação completa
- [ ] Deploy em produção
- [ ] Monitoramento ativo

---

## Parallelization Strategy

**Fases paralelas:**
- Fase 3 (Dashboard) pode começar após Fase 1
- Fase 4 (Telegram) pode começar após Fase 2
- Fase 5 (Custo) pode ser paralela à Fase 3
- Fase 6 (Otimização) pode começar após Fase 5
- Fase 7 (Segurança) pode começar após Fase 6

**Sequenciais:**
- Fase 0 → Fase 1 → Fase 2 (dependência técnica)
- Fase 7 → Fase 8 → Fase 9 (qualidade antes de deploy)
