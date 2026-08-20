const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

const configService = new ConfigService();

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
    res.json({ success: true, execution });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/executions', auth, rateLimit.publish, async (req, res) => {
  try {
    const execution = await configService.createExecution(req.body);
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