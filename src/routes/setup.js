const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

const configService = new ConfigService();

// Health check endpoint (used by frontend)
router.get('/health', auth, async (req, res) => {
  try {
    const configured = await configService.isSystemConfigured();
    res.json({
      status: configured ? 'healthy' : 'setup_required',
      configured,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Complete setup endpoint (used by frontend)
router.post('/complete', auth, rateLimit.publish, async (req, res) => {
  try {
    await configService.saveConfig(req.body);
    res.json({ success: true, message: 'Configuração salva com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;