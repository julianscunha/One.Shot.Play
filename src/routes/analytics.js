const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const auth = require('../middleware/auth');

const configService = new ConfigService();

router.get('/analytics', auth, async (req, res) => {
  try {
    const canal = req.query.canal;
    const periodo = req.query.periodo || 'diario';

    const dataInicio = new Date();
    if (periodo === 'diario') dataInicio.setDate(dataInicio.getDate() - 1);
    else if (periodo === 'semanal') dataInicio.setDate(dataInicio.getDate() - 7);
    else if (periodo === 'mensal') dataInicio.setMonth(dataInicio.getMonth() - 1);

    const executions = await configService.listExecutions(100);

    const dados = {
      periodo,
      totalExecucoes: executions.length,
      sucesso: executions.filter(e => e.status === 'concluido').length,
      falha: executions.filter(e => e.status === 'falha').length,
      estimativaGanhos: (executions.filter(e => e.status === 'concluido').length * 0.5).toFixed(2)
    };

    res.json(dados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/market-trends', auth, async (req, res) => {
  try {
    const trends = [
      { categoria: 'infantil', crescimento: 15, motivo: 'Alta demanda por conteúdo educativo infantil' },
      { categoria: 'musical', crescimento: 12, motivo: 'Vídeos musicais relaxantes em alta' },
      { categoria: 'educacional', crescimento: 8, motivo: 'Conteúdo educativo crescente' },
      { categoria: 'relaxante', crescimento: 10, motivo: 'Conteúdo para bem-estar em alta' }
    ];

    res.json({ trends, recomendacao: trends[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
