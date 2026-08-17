# Spec: Refatoração Completa do YouTube Automation Agent

## Idioma Padrão

**Todo o sistema será em pt-BR:**
- Interface web (dashboard, configurações, formulários)
- Documentação (README, ADRs, guias)
- Alertas e notificações (Telegram, painel)
- Logs e mensagens de erro
- Interação com usuário (questionários, confirmações)
- Código: comentários em pt-BR, variáveis em inglês (padrão técnico)

## Limpeza de Código Morto

**A cada fase completada:**
- Remover arquivos, funções, variáveis não utilizadas
- Remover dependências órfãs (`npm prune`)
- Remover modos/rotas/flags legadas
- Manter apenas o código ativo e necessário

## Otimização com PonyTail

**A cada 2 fases completadas:**
- Rodar análise do PonyTail no repositório
- Aplicar as sugestões de otimização geradas
- Documentar melhorias no `docs/PERF-BENCHMARK.md`
- Reavaliar após aplicação

## Objective

Transformar o YouTube Automation Agent em uma aplicação web profissional, empresarial, pronta para produção, com interface de configuração completa, pipeline de vídeo robusta, multi-provider com fallback, execução monitorada, e hospedagem no Back4App free tier.

## Contexto Atual

O sistema atual é um agente de automação de YouTube com múltiplos modos de inicialização (`workflow`, `simple`), configuração via arquivos e CLI, e interface web básica com dados mockados. A arquitetura atual mistura concerns de configuração, agentes de IA, produção de vídeo, publicação e dashboard em um único monólito sem camadas claras.

## Stack Alvo

- **Runtime:** Node.js 20+
- **Framework:** Express.js (compatível com Back4App free tier)
- **Database:** MongoDB (nativo no Back4App)
- **Frontend:** HTML/CSS/JS vanilla (leve para free tier) ou EJS/Handlebars
- **Host:** Back4App free tier
- **LLM/AI:** OpenRouter (primary) + fallback configurável
- **TTS:** ElevenLabs / Google TTS / Azure Speech (com fallback)
- **Image/Video:** Replicate / Pollinations / OpenRouter image models (com fallback)
- **Telegram:** Bot API para notificações e comandos

## Arquitetura Proposta

```
┌─────────────────────────────────────────┐
│           Back4App Free Tier            │
│  ┌─────────────┐    ┌───────────────┐  │
│  │   Express   │    │   MongoDB     │  │
│  │   Server    │◄──►│   Database    │  │
│  └──────┬──────┘    └───────────────┘  │
│         │                              │
│  ┌──────┴──────────────────────────┐   │
│  │         Web Dashboard           │   │
│  │  (Config / Metrics / Logs /     │   │
│  │   Scheduling / Templates)       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │      Telegram Bot               │    │
│  │  (Commands / Notifications)     │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
         │
         ▼
    External APIs
    (OpenRouter, YouTube, ElevenLabs,
     Replicate, etc.)
```

### Camadas da Aplicação

```
src/
├── config/
│   ├── providers/          # Configuração de providers com fallback
│   ├── templates/          # Templates de configuração
│   └── secrets.js          # Gerenciamento de secrets (nunca committado)
├── services/
│   ├── ai/                 # Serviços de IA (texto, imagem, vídeo)
│   ├── media/              # Narração, música, legendas
│   ├── youtube/            # Integração YouTube API
│   ├── telegram/           # Bot do Telegram
│   ├── pipeline/           # Engine de execução de pipeline de vídeo
│   └── monitoring/         # Métricas, logs, custos
├── routes/
│   ├── dashboard.js        # Dashboard principal
│   ├── config.js           # Configurações
│   ├── schedule.js         # Agendamentos
│   ├── execution.js        # Execução manual
│   └── api.js              # API REST
├── middleware/
│   ├── auth.js             # Autenticação (API key / sessão)
│   ├── validation.js       # Validação de input
│   └── errorHandler.js     # Tratamento de erros centralizado
├── db/
│   ├── models/             # Modelos MongoDB
│   └── migrations/         # Seeders e migrações
├── workers/
│   ├── scheduler.js        # Agendador de publicações
│   ├── publisher.js        # Worker de publicação
│   └── monitor.js          # Monitor de saúde e custos
└── utils/
    ├── retry.js            # Retry exponencial genérico
    ├── cost.js             # Cálculo e validação de custo
    ├── verification.js     # Verificação pré/pós execução
    └── memory.js           # Sistema de memória/cache
```

## Requisitos Detalhados

### 1. Inicialização Simplificada

**Problema atual:** Múltiplos modos de inicialização (`workflow`, `simple`, etc.), configuração fragmentada entre `.env`, `credentials.json`, CLI interativo.

**Requisito:**
- **Único ponto de entrada:** `index.js` na raiz, sem flags ou modos
- **Primeira execução:** Levanta servidor em modo setup, redireciona para `/setup`
- **Setup web:** Interface para configurar todos os providers, canal, autor, linguagem
- **Após setup:** Aplicação normal com dashboard
- **Back4App:** Deploy compatível com free tier (Express + MongoDB)
- **Variáveis de ambiente:** Apenas `OPENROUTER_API_KEY` e `TELEGRAM_BOT_TOKEN` (o resto via interface)

**Critérios de Aceite:**
- [ ] Apenas um comando para subir: `node index.js`
- [ ] Sem flags, sem modos, sem CLI interativo
- [ ] Setup 100% via web na primeira execução
- [ ] Deploy funcionando no Back4App free tier

### 2. Interface de Configuração & Multi-Provider

**Problema atual:** Configuração via arquivos JSON e `.env`, sem validação, sem fallback.

**Requisito:**
- **Tela de Configuração separada:** `/settings` com abas para cada categoria
- **Providers com fallback:** Para cada serviço (AI, TTS, Image, Video), configurar primary + fallback
- **Timeout e retry:** Cada provider tem timeout configurável, com fallback automático
- **Validação:** Teste de conexão para cada provider antes de salvar
- **Secrets:** Nunca expostos no frontend; armazenados criptografados ou em variáveis de ambiente
- **Canais:** Configurar múltiplos canais YouTube (nome, autor, categoria, privacidade)
- **Idioma padrão:** pt-BR e en-US configuráveis por canal

**Critérios de Aceite:**
- [ ] Tela `/settings` com todas as configurações
- [ ] Cada provider aceita primary + fallback
- [ ] Timeout configurável por provider (padrão: 30s)
- [ ] Fallback automático em caso de falha/timeout
- [ ] Teste de conexão antes de salvar
- [ ] Secrets nunca expostos no frontend

### 3. Dashboard Principal com Dados Reais

**Problema atual:** Dashboard com dados mockados, sem health check real, sem métricas.

**Requisito:**
- **Health do sistema:** Status real de cada serviço (API, workers, banco)
- **Conexão com APIs:** Indicador visual de status de cada provider (online/offline/degraded)
- **Publicações efetuadas:** Contador real vindo do banco de dados
- **Agendamento:** Lista de agendamentos com opção de editar/excluir
- **Execução manual:** Botão com barra de progresso e detalhamento de cada passo
- **Logs em tempo real:** Tela de logs com filtros (nível, data, serviço)
- **Métricas:** Posts concluídos vs. com falha, taxa de sucesso
- **Cancelamento:** Botão para cancelar agendamento
- **Execução manual sempre disponível:** Independente do agendamento automático

**Critérios de Aceite:**
- [ ] Health check reflete status real dos serviços
- [ ] Status de APIs atualizado em tempo real
- [ ] Contadores vêm do banco de dados
- [ ] Agendamentos editáveis/excluíveis
- [ ] Barra de progresso detalhada durante execução
- [ ] Logs filtráveis em tempo real
- [ ] Taxa de sucesso calculada dinamicamente
- [ ] Cancelamento de agendamento funcional

### 4. Configuração de Publicação

**Problema atual:** Configuração de vídeo hardcoded ou limitada, sem controle de qualidade.

**Requisito:**
- **Qualidade de imagem:** Alta / Média / Baixa (afeta resolução e tamanho)
- **Formato:** MP4, WebM
- **Resolução:** 720p / 1080p / 4K (limitado pelo provider)
- **Legendas:** Opcional, formato SRT, cores configuráveis, idioma pt-BR/en-US
- **Música de fundo:** Aleatória, baseada no tema, ou silêncio
- **Narração:** Opcional, idioma pt-BR/en-US, voz masculina/feminina
- **Duração média:** 1 / 3 / 5 / 7 minutos
- **Temas pré-definidos:** Infantil, Educacional, Musical, Cartoon, Relaxante, Aleatório
- **Classificação:** Content rating (G, PG, etc.)
- **Público-alvo:** Bebês, Crianças, Adulto, Relaxante, etc.
- **Canal de destino:** Selecionar canal configurado

**Critérios de Aceite:**
- [ ] Todos os parâmetros configuráveis por template
- [ ] Preview das configurações antes de publicar
- [ ] Validação de combinações (ex: narração sem música)

### 5. Integração com Telegram

**Problema atual:** Sem notificações, sem controle remoto.

**Requisito:**
- **Bot do Telegram:** Comandos para gerenciar o sistema
- **Comandos:**
  - `/status` — Status do sistema
  - `/schedule` — Próximas publicações
  - `/publish [tema] [publico] [canal]` — Publicar imediatamente
  - `/cancel [id]` — Cancelar agendamento
  - `/config [param] [valor]` — Alterar configuração
  - `/logs [filtro]` — Ver logs recentes
- **Questionário interativo:** Se usuário digitar `/publish` sem parâmetros, bot faz perguntas sequenciais:
  1. Qual tema?
  2. Qual público-alvo?
  3. Qual canal?
  4. Qual template?
- **Notificações:** Report de execução, alertas de falha, atingimento de limite de custo
- **Autenticação:** Apenas usuários autorizados podem interagir com o bot

**Critérios de Aceite:**
- [ ] Bot responde a todos os comandos
- [ ] Questionário interativo funciona
- [ ] Notificações enviadas em eventos importantes
- [ ] Apenas usuários autorizados têm acesso

### 6. Sistema de Validação de Custo

**Problema atual:** Sem controle de orçamento, custos podem escalar sem aviso.

**Requisito:**
- **Limite diário/semanal:** Configurável (ex: $1/dia, $7/semana)
- **Cálculo em tempo real:** Estima custo antes de executar
- **Bloqueio inteligente:** Se limite atingido, bloqueia novas execuções
- **Alertas:** Aviso no painel e no Telegram quando atingir 80% e 100% do limite
- **Histórico de custo:** Log de gastos por dia/semana/mês
- **Por provider:** Custo separado por serviço (AI, TTS, Image, Video, YouTube)

**Critérios de Aceite:**
- [ ] Limite configurável por período (diário/semanal)
- [ ] Cálculo de custo antes de cada execução
- [ ] Bloqueio automático ao atingir limite
- [ ] Alertas em 80% e 100%
- [ ] Histórico de custos disponível no dashboard

### 7. Painel de Métricas Integrado

**Problema atual:** Sem métricas reais do YouTube, sem estimativa de ganhos.

**Requisito:**
- **Integração YouTube Analytics:** Views, watch time, subscribers por canal
- **Períodos:** Diário, semanal, mensal
- **Estimativa de ganhos:** Baseado em views e RPM médio do canal
- **Gráficos:** Visualização de tendências
- **Comparativo:** Performance entre canais

**Critérios de Aceite:**
- [ ] Dados reais do YouTube Analytics
- [ ] Filtros por período e canal
- [ ] Estimativa de ganhos exibida
- [ ] Gráficos de tendência funcionais

### 8. Painel de Análise de Mercado

**Problema atual:** Sem análise de tendências, sem sugestões automáticas.

**Requisito:**
- **Análise de tendências:** Identifica tipos de vídeo em alta (religiosos, musicais, etc.)
- **Sugestão de template:** Propõe alteração nas configurações do template
- **Aplicação automática:** Usuário aceita e sistema atualiza template
- **Fontes de dados:** YouTube Trends, Google Trends, análise de competidores

**Critérios de Aceite:**
- [ ] Análise de tendências automática
- [ ] Sugestão de template com justificativa
- [ ] Aplicação da sugestão com um clique
- [ ] Histórico de sugestões

### 9. Sistema de Templates

**Problema atual:** Configuração única, sem reuso, usuário precisa reconfigurar tudo sempre.

**Requisito:**
- **CRUD de templates:** Criar, editar, excluir, duplicar templates
- **Conteúdo do template:** Todos os parâmetros de configuração de vídeo + providers + canal
- **Templates pré-definidos:** Infantil, Educacional, Musical, etc.
- **Template padrão:** Configurável
- **Validação:** Template deve ter todos os campos obrigatórios preenchidos

**Critérios de Aceite:**
- [ ] CRUD completo de templates
- [ ] Templates pré-definidos incluídos
- [ ] Template padrão configurável
- [ ] Validação de campos obrigatórios

### 10. Execução Baseada em Templates

**Problema atual:** Execução sempre usa a mesma configuração, sem flexibilidade.

**Requisito:**
- **Seleção de template:** No agendamento, usuário escolhe qual template usar
- **Múltiplos templates por agendamento:** Pode alternar entre templates em agendamentos diferentes
- **Herança:** Template pode ser editado sem afetar agendamentos existentes (copia snapshot)

**Critérios de Aceite:**
- [ ] Template selecionável no agendamento
- [ ] Snapshots de template preservados nos agendamentos
- [ ] Alteração de template não afeta agendamentos existentes

### 11. Agendamento Flexível

**Problema atual:** Frequência fixa ou limitada.

**Requisito:**
- **Opções de frequência:**
  - 1x por dia
  - 2x por dia
  - 4x por dia
  - 3x por semana
  - 1x por semana
- **Horário configurável:** Por agendamento
- **Dias da semana:** Configuráveis para frequências semanais
- **Time zone:** Suporte a múltiplos fusos horários

**Critérios de Aceite:**
- [ ] Todas as frequências funcionam
- [ ] Horário e dia configuráveis
- [ ] Time zone suportado
- [ ] Visualização de agendamentos em calendário (opcional)

### 12. Sistema de Verificação Pré/Prós-Execução

**Problema atual:** Sem validação prévia, sem verificação de qualidade do vídeo.

**Requisito:**
- **Pré-execução:**
  - Verifica status da conta YouTube (restrições, avisos)
  - Verifica limites de API
  - Verifica saldo/limite de custo
  - Valida configuração do template
  - Verifica se há conflito de agendamento
- **Pós-criação:**
  - Análise de imagens para detectar alucinações (pessoas deformadas, etc.)
  - Verificação de duração do vídeo
  - Verificação de qualidade de áudio
  - Se detectar anomalia: aborta publicação e reinicia
- **Log de verificação:** Registra todas as verificações realizadas

**Critérios de Aceite:**
- [ ] Verificação prévia executa antes de cada publicação
- [ ] Verificação pós-criação detecta alucinações visuais
- [ ] Publicação abortada e reiniciada em caso de anomalia
- [ ] Log de verificação disponível

### 13. Retry por Fase

**Problema atual:** Retry genérico ou inexistente, falhas reiniciam todo o processo.

**Requisito:**
- **Pipeline em fases:** Cada etapa é independente e retryable
- **Retry exponencial:** 10s, 20s, 40s... até 10 minutos
- **Classificação de erro:**
  - `TRANSIENT` — timeout, rate limit, conexão → retry
  - `FATAL` — saldo insuficiente, API key inválida → não retry, alerta
- **Checkpoint:** Estado salvo no banco após cada fase
- **Resumo:** Log de retries por fase

**Critérios de Aceite:**
- [ ] Retry por fase, não por pipeline completo
- [ ] Retry exponencial com backoff
- [ ] Classificação correta de erros (transient vs fatal)
- [ ] Checkpoint salvo após cada fase
- [ ] Máximo de retries respeitado

### 14. Otimização Extrema de Recursos

**Problema atual:** Código com desperdício de tokens, processos ineficientes, sem cache.

**Requisito:**
- **Auditoria completa:** Identificar pontos de desperdício
- **Otimizações:**
  - Cache de respostas de IA (quando aplicável)
  - Lazy loading de serviços
  - Pool de conexões
  - Compressão de payloads
  - Reuso de assets (imagens, áudios) quando possível
  - Batch requests onde suportado
  - Remoção de código morto e dependências não usadas
- **Monitoramento de recursos:** CPU, memória, tokens por execução
- **Target:** Redução de 30-50% no consumo de recursos

**Critérios de Aceite:**
- [ ] Auditoria documentada com pontos de otimização
- [ ] Cache implementado para respostas repetidas
- [ ] Pool de conexões ativo
- [ ] Código morto removido
- [ ] Medição antes/depois documentada

### 15. Sistema de Memória e Melhoria Constante

**Problema atual:** Sem persistência de aprendizado, cada execução é isolada.

**Requisito:**
- **Memória de execuções:** Registra o que funcionou e o que falhou
- **Reuso inteligente:** Reusa assets (imagens, áudios, scripts) quando relevante
- **Aprendizado de padrões:** Identifica combinações que geram melhor performance
- **Sugestões automáticas:** Baseado em histórico, sugere ajustes
- **Versionamento de templates:** Melhorias baseadas em performance

**Critérios de Aceite:**
- [ ] Histórico de execuções com métricas
- [ ] Reuso de assets quando aplicável
- [ ] Padrões de sucesso identificados
- [ ] Sugestões baseadas em dados históricos

### 16. Segurança para Servidor Público

**Problema atual:** Sistema projetado para uso local, sem hardening para internet.

**Requisitos:**
- **Helmet.js** para headers de segurança
- **Rate limiting** em todas as rotas
- **Autenticação:** API key obrigatória para rotas mutantes
- **Validação de input** em todas as boundaries
- **Sanitização** de dados de usuário
- **Logs sem secrets/PII**
- **CORS** restrito a origens conhecidas
- **HTTPS** obrigatório (fornecido pelo Back4App)
- **Secrets** nunca commitados, apenas em variáveis de ambiente do Back4App

**Critérios de Aceite:**
- [ ] Helmet.js configurado
- [ ] Rate limiting em todas as rotas
- [ ] API key obrigatória para mutações
- [ ] Input validado em todas as boundaries
- [ ] Nenhum secret no código
- [ ] Logs sem dados sensíveis

### 17. Outras Sugestões

**Sugestões adicionais relevantes:**

#### 17.1. Observabilidade e Monitoring
- Métricas de cada fase do pipeline
- Tracing de requisições
- Alertas proativos no Telegram
- Dashboard de saúde do sistema

#### 17.2. CI/CD
- GitHub Actions para lint, test, build
- Deploy automático para Back4App
- Branch protection e required reviews

#### 17.3. Database Design
- Modelos bem definidos com índices
- Migrations versionadas
- Backup automático (fornecido pelo Back4App)

#### 17.4. Error Handling
- Tratamento centralizado de erros
- Classificação de erros (transient/fatal)
- Retry com circuit breaker
- Dead letter queue para falhas permanentes

#### 17.5. Internacionalização
- Suporte a pt-BR e en-US em toda interface
- Templates com idioma configurável
- Respostas do Telegram no idioma do usuário

## Success Criteria

1. Aplicação sobe com um único comando, sem modos
2. Setup 100% via web
3. Deploy funcionando no Back4App free tier
4. Dashboard com dados reais (não mockados)
5. Multi-provider com fallback funcional
6. Retry por fase com classificação de erro
7. Sistema de custo com alertas
8. Telegram bot funcional
9. Templates CRUD completo
10. Verificação pré/pós-execução
11. Código otimizado e seguro para produção pública

## Non-Goals

- Não migrar para outro provedor de cloud (Back4App é o alvo)
- Não reescrever em outra linguagem (manter Node.js)
- Não implementar features que não estão na lista (manter escopo)

## Open Questions

1. O Back4App free tier suporta workers agendados? Precisaremos de um worker node separado ou usaremos o próprio servidor Express?
2. Qual o limite exato de tokens do OpenRouter free tier? Precisamos definir limites conservadores.
3. O YouTube Data API v3 tem limite de quota. Precisamos definir limites por canal.
4. Devemos usar WebSocket para logs em tempo real ou polling? (Back4App free tier pode ter limitações)
