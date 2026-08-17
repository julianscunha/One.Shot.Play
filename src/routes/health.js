const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');

router.get('/health', async (req, res) => {
  try {
    const configService = new ConfigService();
    const configured = await configService.isSystemConfigured();
    res.json({
      status: 'healthy',
      configured,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

module.exports = router;
