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
      
      // Seed sample data
      await this.seedSampleData();
      
      // Mark system as configured
      await this.executeQuery(
        'INSERT OR IGNORE INTO settings (key, value, description) VALUES (?, ?, ?)',
        ['system_configured', 'true', 'System setup completed']
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

        // Schedules table
        `CREATE TABLE IF NOT EXISTS schedules (
          id TEXT PRIMARY KEY,
          nome TEXT NOT NULL,
          template_id TEXT,
          frequencia TEXT,
          hora TEXT,
          ativo INTEGER DEFAULT 1,
          descricao TEXT,
          proximo TEXT,
          ultima_execucao TEXT,
          custo REAL DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`
      ];
    
      for (const tableQuery of tables) {
        await this.executeQuery(tableQuery);
      }
    }

    async execute(sql, params = []) {
      return this.executeQuery(sql, params);
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
  }

  async executeQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  async getRows(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getRow(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  generateId(prefix = '') {
    return prefix + Date.now() + Math.random().toString(36).substr(2, 9);
  }

  close() {
    return new Promise((resolve) => {
      this.db.close(() => {
        resolve();
      });
    });
  }
}

module.exports = { Database };