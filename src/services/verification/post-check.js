const sharp = require('sharp');

class PostCheckService {
  constructor() {
    this.threshold = 0.7;
  }

  async verificarImagem(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      if (metadata.width < 100 || metadata.height < 100) {
        return { sucesso: false, motivo: 'Imagem muito pequena' };
      }
      return { sucesso: true };
    } catch (error) {
      return { sucesso: false, motivo: `Erro ao processar imagem: ${error.message}` };
    }
  }

  async verificarVideo(videoPath) {
    try {
      const metadata = await sharp(videoPath).metadata();
      return { sucesso: true };
    } catch (error) {
      return { sucesso: false, motivo: `Erro ao processar vídeo: ${error.message}` };
    }
  }

  async verificarExecucao(executionId) {
    const resultado = {
      imagens: await this.verificarImagens(executionId),
      video: await this.verificarVideoFinal(executionId),
      sucesso: true
    };

    if (!resultado.imagens.sucesso || !resultado.video.sucesso) {
      resultado.sucesso = false;
    }

    return resultado;
  }

  async verificarImagens(executionId) {
    return { sucesso: true, total: 0, falhas: 0 };
  }

  async verificarVideoFinal(executionId) {
    return { sucesso: true };
  }
}

module.exports = { PostCheckService };
