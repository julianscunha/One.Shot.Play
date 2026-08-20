const TelegramBot = require('node-telegram-bot-api');
const { ConfigService } = require('../services/config');
const { PreCheckService } = require('../services/verification');
const { PipelineWorker } = require('../services/pipeline/worker');
const { Logger } = require('../../utils/logger');

const logger = new Logger('TelegramBot');

class TelegramBotService {
  constructor() {
    this.bot = null;
    this.configService = new ConfigService();
    this.preCheck = new PreCheckService();
    this.pipelineWorker = new PipelineWorker();
    this.allowedUsers = [];
    this.conversations = new Map();
  }

  inicializar(configService) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      logger.warn('TELEGRAM_BOT_TOKEN não configurado');
      return;
    }

    this.bot = new TelegramBot(token, { polling: true });
    this.allowedUsers = process.env.TELEGRAM_ALLOWED_USERS?.split(',').map(Number) || [];

    this.bot.onText(/\/start/, (msg) => this.handleStart(msg));
    this.bot.onText(/\/status/, (msg) => this.handleStatus(msg));
    this.bot.onText(/\/schedule/, (msg) => this.handleSchedule(msg));
    this.bot.onText(/\/publish/, (msg) => this.handlePublish(msg));
    this.bot.onText(/\/cancel/, (msg) => this.handleCancel(msg));
    this.bot.onText(/\/logs/, (msg) => this.handleLogs(msg));
    this.bot.onText(/\/config/, (msg) => this.handleConfig(msg));
    this.bot.on('message', (msg) => this.handleMessage(msg));

    logger.info('Bot do Telegram inicializado');
  }

  async handleStart(msg) {
    if (!this.isAllowed(msg.from.id)) return;
    await this.bot.sendMessage(msg.chat.id, 'Bem-vindo ao YouTube Automation Bot! Use /status para ver o status do sistema.');
  }

  async handleStatus(msg) {
    if (!this.isAllowed(msg.from.id)) return;
    try {
      const globalFetch = globalThis.fetch || require('node-fetch');
      const health = await globalFetch('http://localhost:3456/api/health').then(r => r.json());
      await this.bot.sendMessage(msg.chat.id, `Status: ${health.status}\nUptime: ${Math.round(health.uptime / 60)} minutos`);
    } catch (_error) {
      await this.bot.sendMessage(msg.chat.id, 'Erro ao obter status');
    }
  }

  async handleSchedule(msg) {
    if (!this.isAllowed(msg.from.id)) return;
    try {
      const globalFetch = globalThis.fetch || require('node-fetch');
      const schedules = await globalFetch('http://localhost:3456/api/schedules').then(r => r.json());
      const texto = schedules.map(s => `${s.nome} - ${s.frequencia} - ${s.horario}`).join('\n') || 'Nenhum agendamento';
      await this.bot.sendMessage(msg.chat.id, texto);
    } catch (_error) {
      await this.bot.sendMessage(msg.chat.id, 'Erro ao obter agendamentos');
    }
  }

  async handlePublish(msg) {
    if (!this.isAllowed(msg.from.id)) return;
    const chatId = msg.chat.id;
    this.conversations.set(chatId, { step: 'tema' });
    await this.bot.sendMessage(chatId, 'Qual o tema do vídeo?');
  }

  async handleCancel(msg) {
    if (!this.isAllowed(msg.from.id)) return;
    await this.bot.sendMessage(msg.chat.id, 'Funcionalidade de cancelamento em desenvolvimento');
  }

  async handleLogs(msg) {
    if (!this.isAllowed(msg.from.id)) return;
    try {
      const globalFetch = globalThis.fetch || require('node-fetch');
      const logs = await globalFetch('http://localhost:3456/api/logs?limit=10').then(r => r.json());
      const texto = logs.map(l => `${l.nivel}: ${l.mensagem}`).join('\n') || 'Sem logs';
      await this.bot.sendMessage(msg.chat.id, texto);
    } catch (_error) {
      await this.bot.sendMessage(msg.chat.id, 'Erro ao obter logs');
    }
  }

  async handleConfig(msg) {
    if (!this.isAllowed(msg.from.id)) return;
    await this.bot.sendMessage(msg.chat.id, 'Funcionalidade de configuração via bot em desenvolvimento');
  }

  async handleMessage(msg) {
    if (!this.isAllowed(msg.from.id)) return;
    const chatId = msg.chat.id;
    const conversation = this.conversations.get(chatId);

    if (!conversation) return;

    switch (conversation.step) {
      case 'tema':
        conversation.tema = msg.text;
        conversation.step = 'publico';
        await this.bot.sendMessage(chatId, 'Qual o público-alvo?');
        break;
      case 'publico':
        conversation.publico = msg.text;
        conversation.step = 'canal';
        await this.bot.sendMessage(chatId, 'Qual o canal?');
        break;
      case 'canal':
        conversation.canal = msg.text;
        await this.bot.sendMessage(chatId, 'Publicação iniciada com sucesso!');
        this.conversations.delete(chatId);
        break;
    }
  }

  isAllowed(userId) {
    return this.allowedUsers.length === 0 || this.allowedUsers.includes(userId);
  }

  async enviarNotificacao(mensagem) {
    if (!this.bot || this.allowedUsers.length === 0) return;
    for (const userId of this.allowedUsers) {
      await this.bot.sendMessage(userId, mensagem);
    }
  }

  async enviarAlerta(titulo, mensagem) {
    const texto = `🚨 ${titulo}\n\n${mensagem}`;
    await this.enviarNotificacao(texto);
  }
}

module.exports = new TelegramBotService();
