const { retry, RetryError } = require('../utils/retry');
const { ERROR_TYPES, isRetryable } = require('../utils/errors');

class PipelineEngine {
  constructor(configService) {
    this.configService = configService;
    this.fases = [
      { nome: 'estrategia', acao: 'gerarEstrategia' },
      { nome: 'script', acao: 'gerarScript' },
      { nome: 'audio', acao: 'gerarAudio' },
      { nome: 'imagens', acao: 'gerarImagens' },
      { nome: 'video', acao: 'montarVideo' },
      { nome: 'legenda', acao: 'adicionarLegenda' },
      { nome: 'upload', acao: 'publicarYouTube' }
    ];
  }

  async executar(executionId, template) {
    const execution = await this.configService.getExecution(executionId);
    if (!execution) throw new Error('Execução não encontrada');

    const fasesIniciais = this.fases.map(f => ({
      nome: f.nome,
      status: 'pendente',
      tentativas: 0
    }));

    await this.configService.updateExecution(executionId, {
      status: 'executando',
      fases: fasesIniciais,
      progresso: 0
    });

    for (let i = 0; i < this.fases.length; i++) {
      const fase = this.fases[i];

      await this.configService.updateExecution(executionId, {
        faseAtual: fase.nome,
        progresso: Math.round((i / this.fases.length) * 100)
      });

      await this.configService.updateExecution(executionId, {
        fases: execution.fases.map((f, idx) =>
          idx === i ? { ...f, status: 'executando' } : f
        )
      });

      try {
        await this.executarFase(executionId, fase, template);
        await this.configService.updateExecution(executionId, {
          fases: execution.fases.map((f, idx) =>
            idx === i ? { ...f, status: 'concluido', fim: new Date() } : f
          )
        });
      } catch (error) {
        const tipo = require('../utils/errors').classifyError(error);
        const tentativas = (execution.fases[i]?.tentativas || 0) + 1;

        await this.configService.addLog({
          nivel: 'error',
          servico: 'pipeline',
          mensagem: `Falha na fase ${fase.nome}: ${error.message}`,
          execution: executionId,
          detalhes: { tipo, tentativas }
        });

        if (tipo === ERROR_TYPES.FATAL || tentativas >= 3) {
          await this.configService.updateExecution(executionId, {
            status: 'falha',
            erro: error.message,
            fases: execution.fases.map((f, idx) =>
              idx === i ? { ...f, status: 'falha', erro: error.message, tentativas } : f
            )
          });
          throw error;
        }

        await this.configService.updateExecution(executionId, {
          fases: execution.fases.map((f, idx) =>
            idx === i ? { ...f, tentativas } : f
          )
        });

        await this.delay(10000 * tentativas);
        i--;
      }
    }

    await this.configService.updateExecution(executionId, {
      status: 'concluido',
      progresso: 100
    });
  }

  async executarFase(executionId, fase, template) {
    await this.configService.addLog({
      nivel: 'info',
      servico: 'pipeline',
      mensagem: `Iniciando fase: ${fase.nome}`,
      execution: executionId
    });

    const resultado = await retry(
      async () => {
        const provider = template.provedores?.[this.mapearTipoProvider(fase.nome)];
        if (!provider) {
          throw new Error(`Provider não configurado para ${fase.nome}`);
        }
        return { provider, resultado: 'ok' };
      },
      {
        maxAttempts: 3,
        initialDelay: 10000,
        factor: 2,
        shouldRetry: isRetryable
      }
    );

    await this.configService.addLog({
      nivel: 'info',
      servico: 'pipeline',
      mensagem: `Fase concluída: ${fase.nome}`,
      execution: executionId
    });

    return resultado;
  }

  mapearTipoProvider(faseNome) {
    const mapa = {
      estrategia: 'ai',
      script: 'ai',
      audio: 'tts',
      imagens: 'image',
      video: 'video',
      legenda: 'tts',
      upload: null
    };
    return mapa[faseNome];
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { PipelineEngine };
