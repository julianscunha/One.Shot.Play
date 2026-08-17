const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');

router.get('/status', async (req, res) => {
  try {
    const configService = new ConfigService();
    const configured = await configService.isSystemConfigured();
    res.json({ configured });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/complete', async (req, res) => {
  try {
    const configService = new ConfigService();
    await configService.saveConfig(req.body);
    res.json({ success: true, message: 'Configuração salva com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
