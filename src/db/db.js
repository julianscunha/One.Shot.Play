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
      
      // Create tables
      await this.createTables();
      
      // Insert default settings
      await this.insertDefaultSettings();
      
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
        status TEXT DEFAULT 'processing',
        assets TEXT,
        timeline TEXT,
        scheduled_publish_time TEXT,
        priority INTEGER DEFAULT 50,
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
      ['content_buffer_days', '3', 'Days of content to keep in buffer']
    ];

    for (const [key, value, description] of defaultSettings) {
      await this.executeQuery(
        'INSERT OR IGNORE INTO settings (key, value, description) VALUES (?, ?, ?)',
        [key, value, description]
      );
    }
  }

  async executeQuery(query) {
    return new Promise((resolve, reject) => {
      this.db.run(query, function(err) {
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
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function(err) {
        if (err) {
          this.logger.error('Query execution failed:', err.message, query);
          reject(err);
        } else {
          resolve({ changes: this.changes, lastID: this.lastID });
        }
      });
    });
  }

  generateId(prefix = '') {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = { Database };