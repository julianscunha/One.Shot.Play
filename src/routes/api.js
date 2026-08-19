const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const { CostService } = require('../services/cost');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

const configService = new ConfigService();
const costService = new CostService();

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

// Execute endpoint
router.post('/execute', auth, rateLimit.publish, async (req, res) => {
  try {
    const execution = await configService.createExecution(req.body);
    res.json({ success: true, execution });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;