const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const auth = require('../middleware/auth');

const configService = new ConfigService();

router.get('/logs', auth, async (req, res) => {
  try {
    const { nivel, servico, limit } = req.query;
    const logs = await configService.listLogs(
      { nivel, servico },
      parseInt(limit) || 100
    );
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
