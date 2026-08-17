# YouTube Automation Agent

Sistema profissional de automação de YouTube com multi-provider, templates, pipeline de vídeo robusto e dashboard web.

## 🚀 Quick Start

### Pré-requisitos
- Node.js >= 20
- MongoDB (ou Back4App)
- Contas: OpenRouter, Telegram, YouTube

### Instalação

```bash
npm install
cp .env.example .env
# Edite .env com suas credenciais
npm start
```

Acesse: `http://localhost:3456`

## 📁 Estrutura do Projeto

```
src/
├── config/          # Configurações e templates
├── db/              # Modelos MongoDB
├── middleware/      # Auth, validation, rate limit
├── routes/          # Rotas da API
├── services/        # Lógica de negócio
│   ├── ai/          # Provedores de IA
│   ├── media/       # Narração, música, legendas
│   ├── pipeline/    # Engine de execução
│   ├── telegram/    # Bot do Telegram
│   └── verification/# Pré/pós verificação
├── utils/           # Utilitários
└── workers/         # Agendador, publisher
```

## 🔧 Configuração

1. Acesse `/setup` na primeira execução
2. Configure provedores em `/settings`
3. Crie templates em `/templates`
4. Crie agendamentos em `/schedule`

## 📊 Dashboard

- **Dashboard:** Status do sistema e métricas
- **Configurações:** Provedores, canal, segurança
- **Templates:** CRUD de templates de publicação
- **Agendamentos:** Gerenciar publicações automáticas
- **Logs:** Logs em tempo real com filtros
- **Métricas:** Estatísticas e custos

## 🤖 Telegram Bot

Comandos: `/status`, `/schedule`, `/publish`, `/cancel`, `/logs`, `/config`

## 🔒 Segurança

- Helmet.js
- Rate limiting
- API key obrigatória para mutações
- CORS restrito
- Validação de input
- Sanitização de dados

## 📝 Licença

MIT
