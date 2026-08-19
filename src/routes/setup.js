const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

const configService = new ConfigService();

// Health check endpoint
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

// Setup complete endpoint
router.post('/complete', auth, rateLimit.publish, async (req, res) => {
  try {
    await configService.saveConfig(req.body);
    res.json({ success: true, message: 'Configuração salva com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Provider management endpoints
router.get('/providers', auth, async (req, res) => {
  try {
    const providers = await configService.listProviders();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/providers', auth, rateLimit.publish, async (req, res) => {
  try {
    const provider = await configService.createProvider(req.body);
    res.json({ success: true, provider });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/providers/:id', auth, rateLimit.publish, async (req, res) => {
  try {
    const provider = await configService.updateProvider(req.params.id, req.body);
    res.json({ success: true, provider });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/providers/:id', auth, rateLimit.publish, async (req, res) => {
  try {
    await configService.deleteProvider(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;