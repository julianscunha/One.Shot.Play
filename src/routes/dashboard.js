const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const { CostService } = require('../services/cost');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

const configService = new ConfigService();
const costService = new CostService();

// Removido ou substituído para evitar chamada direta incorreta
module.exports = function(app, configService) {
  app.use('/costs', require('./costs'));
  app.use('/analytics', require('./analytics'));
};
