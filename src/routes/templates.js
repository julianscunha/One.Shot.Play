const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

const configService = new ConfigService();

router.get('/templates', auth, async (req, res) => {
  try {
    const templates = await configService.listTemplates();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/templates/:id', auth, async (req, res) => {
  try {
    const template = await configService.getTemplate(req.params.id);
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/templates', auth, rateLimit.publish, async (req, res) => {
  try {
    const template = await configService.createTemplate(req.body);
    res.json({ success: true, template });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/templates/:id', auth, rateLimit.publish, async (req, res) => {
  try {
    const template = await configService.updateTemplate(req.params.id, req.body);
    res.json({ success: true, template });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/templates/:id', auth, rateLimit.publish, async (req, res) => {
  try {
    await configService.deleteTemplate(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;