require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('./src/middleware/cors');
const compression = require('compression');
const { createLogger } = require('./src/utils/logger');
const { initializeDatabase } = require('./src/db');
const { ConfigService } = require('./src/services/config');
const dashboardRoutes = require('./src/routes/dashboard');
const errorHandler = require('./src/middleware/errorHandler');

const logger = createLogger('Main');
const app = express();
const PORT = process.env.PORT || 3456;

app.use(helmet());
app.use(cors);
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'dashboard')));
app.use(errorHandler);

async function startServer() {
  try {
    // Initialize SQLite database instead of MongoDB
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

    dashboardRoutes(app, configService);

    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error('Falha ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();

