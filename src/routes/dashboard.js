const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const { CostService } = require('../services/cost');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

const configService = new ConfigService();
const costService = new CostService();

router.use('/costs', require('./costs'));
router.use('/analytics', require('./analytics'));

router.get('/suggestions', auth, async (req, res) => {
  try {
    const trends = await fetch('/api/analytics/market-trends').then(r => r.json());
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/templates/:id/apply-suggestion', auth, rateLimit.publish, async (req, res) => {
  try {
    const template = await configService.getTemplate(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }
    res.json({ success: true, message: 'Sugestão aplicada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
