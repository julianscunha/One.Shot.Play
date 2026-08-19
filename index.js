require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const { createLogger } = require('./src/utils/logger');
const { initializeDatabase, getDatabase } = require('./src/db');
const { ConfigService } = require('./src/services/config');
const setupRoutes = require('./src/routes/setup');
const apiRoutes = require('./src/routes/api');

const logger = createLogger('Main');
const app = express();
const PORT = process.env.PORT || 3456;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'dashboard')));

// Endpoint for the frontend to retrieve the API key (same-origin only)
app.get('/api/config/browser-key', (req, res) => {
  const key = process.env.API_KEY;
  if (!key) {
    console.log('API_KEY environment variable not set');
  }
  res.json({ apiKey: key || '' });
});

async function startServer() {
  try {
    await initializeDatabase();

    const configService = new ConfigService();
    const isConfigured = await configService.isSystemConfigured();

    if (!isConfigured) {
      app.get('/', (req, res) => res.redirect('/setup'));
      logger.info('Sistema em modo de configuração inicial');
    } else {
      app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'dashboard', 'index.html')));
      logger.info('Sistema inicializado com sucesso');
    }

    // Montar rotas
    app.use('/setup', setupRoutes);
    app.use('/api', apiRoutes);
    app.use('/api', require('./src/routes/execution'));
    app.use('/api', require('./src/routes/templates'));
    app.use('/api', require('./src/routes/schedule'));
    app.use('/api', require('./src/routes/logs'));
    app.use('/api', require('./src/routes/metrics'));
    app.use('/api', require('./src/routes/config'));
    app.use('/api', require('./src/routes/analytics'));
    app.use('/api', require('./src/routes/costs'));

    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error('Falha ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();