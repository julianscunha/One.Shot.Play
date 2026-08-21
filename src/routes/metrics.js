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

router.get('/metrics/templates', auth, async (req, res) => {
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
        execucoes: used,
        taxaSucesso,
        taxaErro: used > 0 ? 100 - taxaSucesso : 0,
        custoTotal: parseFloat(custoTotal.toFixed(2)),
        tempoMedio: Math.round(Math.random() * 300) // placeholder: real data would come from execution times
      };
    });

    res.json(templateMetrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/metrics/apis', auth, async (req, res) => {
  try {
    const executions = await configService.listExecutions(1000);
    const providers = ['openrouter', 'youtube'];

    const apiMetrics = providers.map(provedor => {
      const reqs = executions.filter(e => e.provedor === provedor);
      const erros = reqs.filter(e => e.status === 'error' || e.status === 'erro').length;
      const custo = reqs.reduce((sum, e) => sum + (e.custo || 0), 0);

      return {
        provedor,
        requisicoes: reqs.length,
        taxaErro: reqs.length > 0 ? Math.round((erros / reqs.length) * 100) : 0,
        custo: parseFloat(custo.toFixed(2)),
        uptime: reqs.length > 0 ? parseFloat((100 - (erros / reqs.length) * 100).toFixed(1)) : 100
      };
    }).filter(a => a.requisicoes > 0);

    res.json(apiMetrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;