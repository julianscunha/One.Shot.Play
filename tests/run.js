const assert = require('assert');

async function testPipeline() {
  console.log('Testando pipeline...');
  const { PipelineEngine } = require('../src/services/pipeline/engine');
  const engine = new PipelineEngine();
  assert(engine.fases.length === 7, 'Pipeline deve ter 7 fases');
  console.log('✅ Pipeline testado');
}

async function testRetry() {
  console.log('Testando retry...');
  const { retry, RetryError } = require('../src/utils/retry');

  let attempts = 0;
  await retry(
    async () => {
      attempts++;
      if (attempts < 3) throw new Error('Falha temporária');
      return 'sucesso';
    },
    { maxAttempts: 3, initialDelay: 10 }
  );

  assert(attempts === 3, 'Deve tentar 3 vezes');
  console.log('✅ Retry testado');
}

async function testCost() {
  console.log('Testando custo...');
  const { CostService } = require('../src/services/cost');
  const costService = new CostService();
  const limite = await costService.verificarLimite();
  assert(typeof limite.total === 'number', 'Total deve ser número');
  assert(typeof limite.limite === 'number', 'Limite deve ser número');
  console.log('✅ Custo testado');
}

async function testErrors() {
  console.log('Testando classificação de erros...');
  const { classifyError, ERROR_TYPES } = require('../src/utils/errors');

  const transient = new Error('ECONNRESET');
  transient.code = 'ECONNRESET';
  assert(classifyError(transient) === ERROR_TYPES.TRANSIENT, 'ECONNRESET deve ser TRANSIENT');

  const fatal = new Error('Invalid API key');
  assert(classifyError(fatal) === ERROR_TYPES.FATAL, 'API key inválida deve ser FATAL');

  console.log('✅ Erros testados');
}

async function runTests() {
  try {
    await testPipeline();
    await testRetry();
    await testCost();
    await testErrors();
    console.log('\n✅ Todos os testes passaram');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Teste falhou:', error);
    process.exit(1);
  }
}

runTests();