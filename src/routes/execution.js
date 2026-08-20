const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const { PipelineWorker } = require('../services/pipeline/worker');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

const configService = new ConfigService();
// ponytail: single shared worker -> one execution runs at a time (PipelineWorker.executando
// is a process-wide lock). Fine for now; move to a queue if throughput matters.
const worker = new PipelineWorker();

async function dispatchExecution(execution) {
  const template = execution.template_id
    ? await configService.getTemplate(execution.template_id)
    : { provedores: {} };

  worker.processarExecucao(execution.id, template || { provedores: {} }).catch(async (error) => {
    await configService.updateExecution(execution.id, { status: 'falha', erro: error.message }).catch(() => {});
  });
}

router.get('/executions', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const executions = await configService.listExecutions(limit);
    res.json(executions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/executions/:id', auth, async (req, res) => {
  try {
    const execution = await configService.getExecution(req.params.id);
    res.json(execution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/execute', auth, rateLimit.publish, async (req, res) => {
  try {
    const execution = await configService.startExecution(req.body);
    dispatchExecution(execution);
    res.json({ success: true, execution });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/executions', auth, rateLimit.publish, async (req, res) => {
  try {
    const execution = await configService.createExecution(req.body);
    dispatchExecution(execution);
    res.json({ success: true, execution });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/executions/:id/cancel', auth, rateLimit.publish, async (req, res) => {
  try {
    const execution = await configService.cancelExecution(req.params.id);
    res.json({ success: true, execution });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;