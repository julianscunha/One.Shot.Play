const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

const configService = new ConfigService();

router.get('/metrics', auth, async (req, res) => {
  try {
    const executions = await configService.listExecutions(1000);
    const costs = await configService.getCosts('mes');
    
    const total = executions.length;
    const successCount = executions.filter(e => e.status === 'success' || e.status === 'concluido').length;
    const taxaSucesso = total > 0 ? Math.round((successCount / total) * 100) : 0;
    const custoTotal = costs.reduce((sum, c) => sum + (c.custo || 0), 0);
    
    const metrics = {
      total,
      taxaSucesso,
      custoTotal: parseFloat(custoTotal.toFixed(2))
    };
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;