const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const auth = require('../middleware/auth');

const configService = new ConfigService();

router.get('/metrics', auth, async (req, res) => {
  try {
    const executions = await configService.listExecutions(100);
    const total = executions.length;
    const sucesso = executions.filter(e => e.status === 'success').length;
    const falha = executions.filter(e => e.status === 'error').length;
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

router.get('/metrics/templates', auth, async (req, res) => {
  try {
    const periodo = req.query.periodo || 'diario';
    const templates = await configService.listTemplates();
    const executions = await configService.listExecutions(200);

    const result = templates.map(t => {
      const execs = executions.filter(e => e.template_id === t.id || e.template === t.nome);
      const total = execs.length;
      const sucesso = execs.filter(e => e.status === 'success').length;
      const falha = execs.filter(e => e.status === 'error').length;
      const custoTotal = execs.reduce((sum, e) => sum + (e.custo || 0), 0);
      const tempoMedio = total > 0 ? (execs.reduce((sum, e) => sum + (e.duracao || 30), 0) / total).toFixed(0) : '0';
      return {
        id: t.id,
        nome: t.nome,
        execucoes: total,
        taxaSucesso: total > 0 ? ((sucesso / total) * 100).toFixed(0) : '0',
        taxaErro: total > 0 ? ((falha / total) * 100).toFixed(0) : '0',
        tempoMedio: `${tempoMedio}s`,
        custoTotal: parseFloat(custoTotal.toFixed(2))
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/metrics/apis', auth, async (req, res) => {
  try {
    const periodo = req.query.periodo || 'diario';
    const costs = await configService.getCosts(periodo);

    const providerStats = {};
    costs.forEach(c => {
      if (!providerStats[c.provedor]) {
        providerStats[c.provedor] = { provedor: c.provedor, requisicoes: 0, custo: 0, erros: 0 };
      }
      providerStats[c.provedor].requisicoes += c.quantia || 1;
      providerStats[c.provedor].custo += c.custo || 0;
    });

    const result = Object.values(providerStats).map(p => ({
      provedor: p.provedor,
      requisicoes: p.requisicoes,
      taxaErro: '0%',
      custo: parseFloat(p.custo.toFixed(2)),
      uptime: '100%'
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/metrics/dashboard', auth, async (req, res) => {
  try {
    const periodo = req.query.periodo || 'diario';
    const executions = await configService.listExecutions(100);
    const costs = await configService.getCosts(periodo);

    const total = executions.length;
    const sucesso = executions.filter(e => e.status === 'success').length;
    const falha = executions.filter(e => e.status === 'error').length;
    const taxaSucesso = total > 0 ? ((sucesso / total) * 100).toFixed(1) : 0;
    const totalCusto = costs.reduce((sum, c) => sum + c.custo, 0);

    // Last 7 days execution counts
    const dailyExecutions = Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      return executions.filter(e => e.timestamp && e.timestamp.startsWith(dateStr)).length;
    });

    res.json({
      total,
      sucesso,
      falha,
      taxaSucesso: `${taxaSucesso}%`,
      totalCusto: parseFloat(totalCusto.toFixed(2)),
      dailyExecutions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
