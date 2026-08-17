const { PipelineEngine } = require('./engine');

module.exports = {
  executarPipeline: (executionId, template) => new PipelineEngine().executar(executionId, template)
};
