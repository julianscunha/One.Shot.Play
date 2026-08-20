const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const auth = require('../middleware/auth');

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

// POST /execute lives in routes/execution.js - it actually dispatches the
// pipeline worker, this stub duplicate never did.
module.exports = router;