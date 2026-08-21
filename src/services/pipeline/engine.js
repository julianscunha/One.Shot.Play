const path = require('path');
const fs = require('fs').promises;
const { ERROR_TYPES, classifyError } = require('../../utils/errors');
const { AIVideoGenerator } = require('../../utils/ai-video-generator');
const { uploadVideo } = require('../youtube/uploader');
const { addCaptionsToVideo } = require('../../utils/captions');

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

  async buildAiGenerator() {
    const providers = await this.configService.listProviders();
    const llm = providers.find(p => p.tipo === 'llm');
    const credentials = llm ? {
      openrouter: {
        apiKey: llm.api_key,
        textModel: llm.config?.textModel,
        imageModel: llm.config?.imageModel,
        ttsModel: llm.config?.ttsModel,
        ttsVoice: llm.config?.ttsVoice
      }
    } : {};
    return new AIVideoGenerator(credentials);
  }

  async executar(executionId, template) {
    const execution = await this.configService.getExecution(executionId);
    if (!execution) throw new Error('Execução não encontrada');

    this.aiGenerator = await this.buildAiGenerator();

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

    const resultado = await this[fase.acao](executionId, template);

    await this.configService.addLog({
      nivel: 'info',
      servico: 'pipeline',
      mensagem: `Fase concluída: ${fase.nome}`,
      execution: executionId
    });

    return resultado;
  }

  // Working files for one execution's audio/images/video live here.
  workDir(executionId) {
    return path.join(__dirname, '..', '..', 'data', 'executions', executionId);
  }

  async mergeAssets(executionId, patch) {
    const execution = await this.configService.getExecution(executionId);
    const assets = { ...(execution?.assets || {}), ...patch };
    await this.configService.updateExecution(executionId, { assets });
    return assets;
  }

  // ponytail: no strategy step beyond picking the topic yet - the template's own
  // text is the topic. gerarScript calls the real LLM (AIVideoGenerator.generateScript,
  // OpenRouter-backed with a simulate fallback when no key is configured).
  async gerarEstrategia(executionId, template) {
    return this.mergeAssets(executionId, {
      estrategia: template?.descricao || template?.nome || 'Estratégia padrão'
    });
  }

  async gerarScript(executionId) {
    const execution = await this.configService.getExecution(executionId);
    const topic = execution.assets?.estrategia || 'Vídeo';
    const script = await this.aiGenerator.generateScript(topic);
    return this.mergeAssets(executionId, { script });
  }

  async gerarAudio(executionId) {
    const execution = await this.configService.getExecution(executionId);
    const script = execution.assets?.script;
    const text = script?.hook?.text || script?.title || 'Conteúdo gerado automaticamente.';
    await fs.mkdir(this.workDir(executionId), { recursive: true });
    const audioPath = path.join(this.workDir(executionId), 'audio.mp3');
    await this.aiGenerator.generateTTSAudio(text, audioPath);
    return this.mergeAssets(executionId, { audioPath });
  }

  async gerarImagens(executionId) {
    const execution = await this.configService.getExecution(executionId);
    const prompt = execution.assets?.script?.title || 'video thumbnail';
    const imagePaths = await this.aiGenerator.generateVisualAssets(prompt, 'cinematic', 3);
    return this.mergeAssets(executionId, { imagePaths });
  }

  async montarVideo(executionId) {
    const execution = await this.configService.getExecution(executionId);
    const { script, audioPath, imagePaths } = execution.assets || {};
    const videoPath = path.join(this.workDir(executionId), 'video.mp4');
    await this.aiGenerator.generateVideo(script || {}, imagePaths || [], audioPath, videoPath);
    return this.mergeAssets(executionId, { videoPath });
  }

  async adicionarLegenda(executionId) {
    const execution = await this.configService.getExecution(executionId);
    const { script, videoPath } = execution.assets || {};

    const hasRealVideo = videoPath && await fs.access(videoPath).then(() => true, () => false);
    if (!hasRealVideo) {
      // upstream video phase simulated (no provider configured) - nothing to caption
      return this.mergeAssets(executionId, { legenda: 'skipped (no real video to caption)' });
    }

    const captionedPath = videoPath.replace(/\.mp4$/i, '_captioned.mp4');
    await addCaptionsToVideo(videoPath, script || {}, captionedPath);
    // downstream (upload) reads assets.videoPath, so point it at the captioned file
    return this.mergeAssets(executionId, { videoPath: captionedPath, legenda: 'concluido' });
  }

  async publicarYouTube(executionId) {
    const execution = await this.configService.getExecution(executionId);
    const { script, videoPath } = execution.assets || {};
    const upload = await uploadVideo(videoPath, script || {});
    return this.mergeAssets(executionId, { upload });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { PipelineEngine };