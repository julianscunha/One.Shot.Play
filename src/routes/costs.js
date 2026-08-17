const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const { CostService } = require('../services/cost');
const auth = require('../middleware/auth');

const configService = new ConfigService();
const costService = new CostService();

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

router.get('/limits', auth, async (req, res) => {
  try {
    const limite = await costService.verificarLimite();
    res.json(limite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/limits/check', auth, async (req, res) => {
  try {
    const limite = await costService.verificarLimite();
    if (limite.atingido) {
      return res.status(429).json({
        error: { code: 'COST_LIMIT_EXCEEDED', message: 'Limite de custo atingido' }
      });
    }
    res.json({ allowed: true, ...limite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
