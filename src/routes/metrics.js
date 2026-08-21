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

router.get('/templates', auth, async (req, res) => {
  try {
    const templates = await configService.listTemplates();
    const executions = await configService.listExecutions(1000);

    const templateMetrics = templates.map(t => {
      const used = executions.filter(e => e.template_id === t.id).length;
      const succeeds = executions.filter(e => e.template_id === t.id && (e.status === 'success' || e.status === 'concluido')).length;
      const taxaSucesso = used > 0 ? Math.round((succeeds / used) * 100) : 0;
      const custoTotal = executions
        .filter(e => e.template_id === t.id)
        .reduce((sum, e) => sum + (e.custo || 0), 0);

      return {
        id: t.id,
        nome: t.nome,
        tipo: t.tipo,
        uso: used,
        taxaSucesso,
        custoTotal: parseFloat(custoTotal.toFixed(2)),
        tempoMedio: Math.round(Math.random() * 300) // placeholder: real data would come from execution times
      };
    });

    res.json(templateMetrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/apis', auth, async (req, res) => {
  try {
    const executions = await configService.listExecutions(1000);

    const apiMetrics = {
      totalRequests: executions.length,
      successRate: executions.filter(e => e.status === 'success' || e.status === 'concluido').length / Math.max(executions.length, 1),
      averageTime: Math.round(Math.random() * 5000) + 1000, // placeholder
      providers: {
        openrouter: executions.filter(e => e.provedor === 'openrouter').length,
        replicate: executions.filter(e => e.provedor === 'replicate').length,
        youtube: executions.filter(e => e.provedor === 'youtube').length
      }
    };

    res.json(apiMetrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;