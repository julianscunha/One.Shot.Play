const PreCheckService = require('./pre-check');
const PostCheckService = require('./post-check');

const preCheck = new PreCheckService();
const postCheck = new PostCheckService();

module.exports = {
  async verificarPreExecucao(executionId, template) {
    return await preCheck.verificar(executionId, template);
  },

  async verificarPosExecucao(executionId) {
    return await postCheck.verificarExecucao(executionId);
  },

  async verificarImagem(imagePath) {
    return await postCheck.verificarImagem(imagePath);
  },

  async verificarVideo(videoPath) {
    return await postCheck.verificarVideo(videoPath);
  }
};
