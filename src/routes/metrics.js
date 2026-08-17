const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const auth = require('../middleware/auth');

const configService = new ConfigService();

router.get('/metrics', auth, async (req, res) => {
  try {
    const executions = await configService.listExecutions(100);
    const total = executions.length;
    const sucesso = executions.filter(e => e.status === 'concluido').length;
    const falha = executions.filter(e => e.status === 'falha').length;
    const taxaSucesso = total > 0 ? ((sucesso / total) * 100).toFixed(1) : 0;

    res.json({
      total,
      sucesso,
      falha,
      taxaSucesso: `${taxaSucesso}%`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/costs', auth, async (req, res) => {
  try {
    const periodo = req.query.periodo || 'diario';
    const costs = await configService.getCosts(periodo);
    const total = costs.reduce((sum, c) => sum + c.custo, 0);
    res.json({ total, periodo, items: costs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
