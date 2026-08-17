# Guia de Uso - YouTube Automation Agent

## 1. Primeira Execução

1. Configure as variáveis de ambiente no Back4App:
   - `OPENROUTER_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `MONGODB_URI` (fornecida pelo Back4App)

2. Acesse a URL do Back4App
3. O sistema redirecionará automaticamente para `/setup`
4. Preencha:
   - Nome do canal
   - Autor
   - API Key do OpenRouter
   - Token do Telegram
5. Clique em "Salvar e Continuar"

## 2. Configuração de Provedores

Acesse `/settings` e configure:
- **Provedores de IA:** OpenRouter (primary) + fallback
- **TTS:** ElevenLabs ou Azure Speech
- **Imagem:** Replicate ou Pollinations
- **Vídeo:** Replicate ou provedor próprio

Cada provedor aceita primary + fallback com timeout configurável.

## 3. Criação de Templates

Acesse `/templates` e clique em "Novo Template":
- Nome e tipo (Infantil, Educacional, Musical, etc.)
- Canal de destino
- Público-alvo
- Idioma (pt-BR ou en-US)
- Qualidade, resolução, duração
- Narração (sim/não, voz masculina/feminina)
- Música de fundo
- Classificação indicativa
- Provedores associados

## 4. Agendamentos

Acesse `/schedule`:
- Clique em "Novo Agendamento"
- Selecione o template
- Escolha a frequência (1x/dia, 2x/dia, 4x/dia, 3x/semana, 1x/semana)
- Defina horário e timezone
- Salve

## 5. Execução Manual

Acesse `/execute.html`:
- Selecione um template
- Clique em "Iniciar Execução"
- Acompanhe o progresso em tempo real
- Cada fase é atualizada automaticamente

## 6. Monitoramento

- **Dashboard (`/`):** Status do sistema, execuções, APIs
- **Logs (`/logs.html`):** Filtros por nível e serviço
- **Métricas (`/metrics.html`):** Estatísticas de execução e custos

## 7. Telegram Bot

Comandos disponíveis:
- `/start` - Inicia o bot
- `/status` - Status do sistema
- `/schedule` - Próximas publicações
- `/publish` - Publicar imediatamente (questionário interativo)
- `/cancel` - Cancelar agendamento
- `/logs` - Logs recentes
- `/config` - Alterar configuração

## 8. Limites de Custo

- Configure limites no `/settings`
- Alertas em 80% e 100% do limite
- Bloqueio automático ao atingir limite
- Histórico disponível em `/metrics.html`

## 9. Troubleshooting

### Erro de conexão com MongoDB
- Verifique a `MONGODB_URI` no Back4App
- Confira se o banco está ativo

### Bot não responde
- Verifique `TELEGRAM_BOT_TOKEN`
- Confira `TELEGRAM_ALLOWED_USERS`

### Falha na geração de vídeo
- Verifique os logs em `/logs.html`
- Confira se os provedores estão configurados
- Verifique limite de custo
