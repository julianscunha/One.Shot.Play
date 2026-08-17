const { PipelineEngine } = require('./engine');
const { ConfigService } = require('../services/config');
const { Logger } = require('../utils/logger');

class PipelineWorker {
  constructor() {
    this.configService = new ConfigService();
    this.pipelineEngine = new PipelineEngine(this.configService);
    this.logger = new Logger('PipelineWorker');
    this.executando = false;
  }

  async inicializar() {
    this.logger.info('Pipeline worker inicializado');
  }

  async processarExecucao(executionId, template) {
    if (this.executando) {
      throw new Error('Worker já está executando uma tarefa');
    }

    this.executando = true;
    try {
      await this.pipelineEngine.executar(executionId, template);
    } finally {
      this.executando = false;
    }
  }

  async cancelarExecucao(executionId) {
    await this.configService.cancelExecution(executionId);
    this.executando = false;
    this.logger.info(`Execução ${executionId} cancelada`);
  }
}

module.exports = { PipelineWorker };
