const { ERROR_TYPES, classifyError } = require('../../utils/errors');

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

    let fasesState = this.fases.map(f => ({
      nome: f.nome,
      status: 'pendente',
      tentativas: 0
    }));

    await this.configService.updateExecution(executionId, {
      status: 'executando',
      fases: fasesState,
      progresso: 0
    });

    for (let i = 0; i < this.fases.length; i++) {
      const fase = this.fases[i];

      fasesState = fasesState.map((f, idx) => idx === i ? { ...f, status: 'executando' } : f);
      await this.configService.updateExecution(executionId, {
        faseAtual: fase.nome,
        progresso: Math.round((i / this.fases.length) * 100),
        fases: fasesState
      });

      try {
        await this.executarFase(executionId, fase, template);
        fasesState = fasesState.map((f, idx) =>
          idx === i ? { ...f, status: 'concluido', fim: new Date() } : f
        );
        await this.configService.updateExecution(executionId, { fases: fasesState });
      } catch (error) {
        const tipo = classifyError(error);
        const tentativas = (fasesState[i]?.tentativas || 0) + 1;

        await this.configService.addLog({
          nivel: 'error',
          servico: 'pipeline',
          mensagem: `Falha na fase ${fase.nome}: ${error.message}`,
          execution: executionId,
          detalhes: { tipo, tentativas }
        });

        if (tipo === ERROR_TYPES.FATAL || tentativas >= 3) {
          fasesState = fasesState.map((f, idx) =>
            idx === i ? { ...f, status: 'falha', erro: error.message, tentativas } : f
          );
          await this.configService.updateExecution(executionId, {
            status: 'falha',
            erro: error.message,
            fases: fasesState
          });
          throw error;
        }

        fasesState = fasesState.map((f, idx) => idx === i ? { ...f, tentativas } : f);
        await this.configService.updateExecution(executionId, { fases: fasesState });

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

    // ponytail: placeholder - no real generation wired yet (AIVideoGenerator/YouTube
    // upload aren't connected here), so this just marks the phase done. Replace when
    // real generation lands; drop mapearTipoProvider() then too if still unused.
    const resultado = { resultado: 'ok' };

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