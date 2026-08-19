const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

const configService = new ConfigService();

router.get('/logs', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const { nivel, servico } = req.query;
    const filtros = {};
    if (nivel) filtros.nivel = nivel;
    if (servico) filtros.servico = servico;
    const logs = await configService.listLogs(filtros, limit);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logs', auth, async (req, res) => {
  try {
    const log = await configService.addLog(req.body);
    res.json({ success: true, log });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;