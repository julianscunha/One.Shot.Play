const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

const configService = new ConfigService();

router.get('/browser-key', (req, res) => {
  const key = process.env.API_KEY;
  res.json({ apiKey: key || '' });
});

router.get('/', auth, async (req, res) => {
  try {
    const config = await configService.getConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, rateLimit.publish, async (req, res) => {
  try {
    const config = await configService.saveConfig(req.body);
    res.json({ success: true, config });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/status', auth, async (req, res) => {
  try {
    const configured = await configService.isSystemConfigured();
    res.json({ configured });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/config', auth, async (req, res) => {
  try {
    const config = await configService.getConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/config', auth, rateLimit.publish, async (req, res) => {
  try {
    const config = await configService.saveConfig(req.body);
    res.json({ success: true, config });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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