// Simple database implementation
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs').promises;
const { createLogger } = require('../utils/logger');

class Database {
  constructor() {
    this.dbPath = path.join(__dirname, '..', 'data', 'one-shot-play.db');
   this.db = null;
   this.logger = createLogger('Database');
   this._initialized = false;
   this._initializationPromise = null;
  }

  async initialize() {
    if (this._initialized) {
      return this;
    }
    
    if (this._initializationPromise) {
      await this._initializationPromise;
      return this;
    }
    
    this._initializationPromise = this._initializeInternal();
    await this._initializationPromise;
    this._initialized = true;
    this._initializationPromise = null;
    
    return this;
  }

  async _initializeInternal() {
    try {
      this.logger.info('Initializing database...');
      
      // Ensure data directory exists
      await fs.mkdir(path.dirname(this.dbPath), { recursive: true });
      
      // Connect to database
      this.db = new sqlite3.Database(this.dbPath);
      this._initialized = true;

      // Create tables
      await this.createTables();
      
      // Run migrations (safe no-ops if columns already exist)
      await this.migrate();
      
      // Seed sample data if empty
      await this.seedSampleData();

      // Mark system as configured
      await this.executeQuery(
        'INSERT OR IGNORE INTO settings (key, value, description) VALUES (?, ?, ?)',
        ['system_configured', 'true', 'System setup completed']
      );
      await this.executeQuery(
        'UPDATE settings SET value = ? WHERE key = ?',
        ['true', 'system_configured']
      );

      this.logger.info('Database initialized successfully');
      return;
    } catch (error) {
      this.logger.error('Failed to initialize database:', error);
      throw error;
    }
  }

  async createTables() {
    const tables = [
      // System Settings (essential for ConfigService)
      `CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        description TEXT,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Providers table
      `CREATE TABLE IF NOT EXISTS providers (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        tipo TEXT,
        api_key TEXT,
        endpoint TEXT,
        ativo INTEGER DEFAULT 1,
        config TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Templates table
      `CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        descricao TEXT,
        tipo TEXT,
        provedores TEXT,
        config TEXT,
        ativo INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Schedules table
      `CREATE TABLE IF NOT EXISTS publish_schedule (
        id TEXT PRIMARY KEY,
        production_id TEXT NOT NULL,
        title TEXT NOT NULL,
        publish_time TEXT NOT NULL,
        status TEXT DEFAULT 'scheduled',
        priority INTEGER DEFAULT 50,
        metadata TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Productions table
      `CREATE TABLE IF NOT EXISTS productions (
        id TEXT PRIMARY KEY,
        template_id TEXT,
        nome TEXT,
        status TEXT DEFAULT 'processing',
        assets TEXT,
        timeline TEXT,
        scheduled_publish_time TEXT,
        priority INTEGER DEFAULT 50,
        custo REAL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Logs table
      `CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY,
        nivel TEXT,
        servico TEXT,
        mensagem TEXT,
        dados TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Cost logs table
      `CREATE TABLE IF NOT EXISTS cost_logs (
        id TEXT PRIMARY KEY,
        provedor TEXT,
        tipo TEXT,
        custo REAL,
        moeda TEXT,
        quantia REAL,
        dados TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Memories table
      `CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        tipo TEXT NOT NULL,
        chave TEXT NOT NULL,
        valor TEXT,
        expires_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const tableQuery of tables) {
      await this.executeQuery(tableQuery);
    }

    // Insert default settings
    await this.insertDefaultSettings();
  }

  async insertDefaultSettings() {
    const defaultSettings = [
      ['daily_content_enabled', 'true', 'Enable daily content generation'],
      ['auto_publish_enabled', 'true', 'Enable automatic publishing'],
      ['analytics_enabled', 'true', 'Enable analytics collection'],
      ['optimization_enabled', 'true', 'Enable automatic optimization'],
      ['publish_time_optimization', 'true', 'Optimize publishing times automatically'],
      ['thumbnail_ab_testing', 'false', 'Enable thumbnail A/B testing'],
      ['content_backup_enabled', 'true', 'Enable content backup'],
      ['notification_enabled', 'true', 'Enable system notifications'],
      ['max_daily_posts', '1', 'Maximum posts per day'],
      ['content_buffer_days', '3', 'Days of content to keep in buffer'],
      ['system_configured', 'false', 'System setup completed']
    ];

    for (const [key, value, description] of defaultSettings) {
      await this.executeQuery(
        'INSERT OR IGNORE INTO settings (key, value, description) VALUES (?, ?, ?)',
        [key, value, description]
      );
    }
  }

  async migrate() {
    // Ensure new columns exist on existing databases
    const migrations = [
      'ALTER TABLE productions ADD COLUMN template_id TEXT',
      'ALTER TABLE productions ADD COLUMN nome TEXT',
      'ALTER TABLE productions ADD COLUMN custo REAL DEFAULT 0'
    ];

    for (const sql of migrations) {
      try {
        await this.executeQuery(sql);
      } catch (err) {
        // Column already exists — safe to ignore
        if (!err.message.includes('duplicate column')) {
          this.logger.warn('Migration warning:', err.message);
        }
      }
    }
    this.logger.info('Migrations applied');
  }

  async seedSampleData() {
    // Check if data exists
    const count = await this.getRows('SELECT COUNT(*) as cnt FROM templates');
    if (count[0].cnt > 0) return;

    // Seed templates
    const templates = [
      { id: 'tmpl_001', nome: 'Daily News Brief', descricao: 'Notícias resumidas diariamente com análise.', tipo: 'news', provedores: '[]', ativo: 1 },
      { id: 'tmpl_002', nome: 'Tutorial Tech', descricao: 'Tutoriais de tecnologia e ferramentas.', tipo: 'tutorial', provedores: '[]', ativo: 1 },
      { id: 'tmpl_003', nome: 'Top 10 Conteúdo', descricao: 'Listas de 10 itens sobre tendências.', tipo: 'list', provedores: '[]', ativo: 1 }
    ];

    for (const t of templates) {
      await this.executeQuery(
        'INSERT OR IGNORE INTO templates (id, nome, descricao, tipo, provedores, config, ativo) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [t.id, t.nome, t.descricao, t.tipo, t.provedores, null, t.ativo]
      );
    }

    // Seed providers
    const providers = [
      { id: 'prov_001', nome: 'OpenRouter', tipo: 'llm', endpoint: 'https://openrouter.ai/api', api_key: 'configured', ativo: 1, config: '{"model":"gpt-4o"}' },
      { id: 'prov_002', nome: 'YouTube Data API', tipo: 'api', endpoint: 'https://youtube.googleapis.com', api_key: 'configured', ativo: 1, config: '{}' },
      { id: 'prov_003', nome: 'Telegram Bot', tipo: 'notification', endpoint: 'https://api.telegram.org', api_key: 'configured', ativo: 1, config: '{}' }
    ];

    for (const p of providers) {
      await this.executeQuery(
        'INSERT OR IGNORE INTO providers (id, nome, tipo, api_key, endpoint, ativo, config) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [p.id, p.nome, p.tipo, p.api_key, p.endpoint, p.ativo, p.config]
      );
    }

    // Seed sample executions
    const statuses = ['concluido', 'concluido', 'concluido', 'concluido', 'falha', 'processando'];
    const templates_list = ['Daily News Brief', 'Tutorial Tech', 'Top 10 Conteúdo'];
    for (let i = 0; i < 6; i++) {
      const execId = 'exec_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      const template = templates_list[Math.floor(Math.random() * templates_list.length)];
      const status = statuses[i];
      const now = new Date();
      now.setDate(now.getDate() - i);
      await this.executeQuery(
        'INSERT OR IGNORE INTO productions (id, template_id, nome, status, assets, timeline, scheduled_publish_time, priority, custo, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [execId, 'tmpl_001', template, status, '{}', '{}', null, 50, 0.12, now.toISOString()]
      );
    }

    // Seed sample logs
    const logEntries = [
      ['info', 'orchestrator', 'Sistema inicializado com sucesso'],
      ['info', 'youtube', 'Upload concluído: Daily News Brief #1'],
      ['warning', 'ai', 'Latência da API acima de 1 segundo'],
      ['error', 'youtube', 'Falha no upload: quota excedida'],
      ['info', 'cost', 'Custo registrado: $0.012 (OpenRouter)']
    ];

    for (const [nivel, servico, mensagem] of logEntries) {
      const logId = 'log_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      await this.executeQuery(
        'INSERT INTO logs (id, nivel, servico, mensagem, dados, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [logId, nivel, servico, mensagem, null, new Date().toISOString()]
      );
    }

    // Seed sample costs
    const costEntries = [
      ['OpenRouter', 'llm', 0.024, 'USD', 1],
      ['OpenRouter', 'llm', 0.018, 'USD', 1],
      ['YouTube Data API', 'api', 0.0, 'USD', 1],
      ['ElevenLabs', 'tts', 0.05, 'USD', 1]
    ];

    for (const [provedor, tipo, custo, moeda, quantia] of costEntries) {
      const costId = 'cost_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      const now = new Date();
      now.setHours(now.getHours() - Math.floor(Math.random() * 24));
      await this.executeQuery(
        'INSERT INTO cost_logs (id, provedor, tipo, custo, moeda, quantia, dados, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [costId, provedor, tipo, custo, moeda, quantia, null, now.toISOString()]
      );
    }

    this.logger.info('Dados de exemplo inseridos');
  }

  async executeQuery(query, params = []) {
    if (!this._initialized) {
      throw new Error('Database not initialized');
    }
    return new Promise((resolve, reject) => {
      this.db.run(query, params, (err) => {
        if (err) {
          this.logger.error('Query execution failed:', err.message, query);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async getRows(query, params = []) {
    if (!this._initialized) {
      throw new Error('Database not initialized');
    }
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          this.logger.error('Query execution failed:', err.message, query);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  async getRow(query, params = []) {
    if (!this._initialized) {
      throw new Error('Database not initialized');
    }
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) {
          this.logger.error('Query execution failed:', err.message, query);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async execute(query, params = []) {
    if (!this._initialized) {
      throw new Error('Database not initialized');
    }
    const self = this;
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function(err) {
        if (err) {
          self.logger.error('Query execution failed:', err.message, query);
          reject(err);
        } else {
          resolve({ changes: this.changes, lastID: this.lastID });
        }
      });
    });
  }

  generateId(_prefix = '') {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = { Database };