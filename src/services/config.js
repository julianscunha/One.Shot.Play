const { createLogger } = require('../utils/logger');

const _logger = createLogger('ConfigService');
const STATUS_MAP = {
  'concluido': 'success',
  'falha': 'error',
  'erro': 'error',
  'processando': 'running',
  'running': 'running',
  'pending': 'pending',
  'agendado': 'pending',
  'cancelado': 'pending',
  'falhou': 'error'
};

class ConfigService {
  constructor() {
    this.db = null;
    this._dbInitialized = false;
  }

  async _getDb() {
    if (!this._dbInitialized) {
      const { initializeDatabase } = require('../db');
      await initializeDatabase();
      this.db = require('../db').getDatabase();
      this._dbInitialized = true;
    }
    return this.db;
  }

  async isSystemConfigured() {
    const db = await this._getDb();
    const settings = await db.getRows('SELECT value FROM settings WHERE key = ?', ['system_configured']);
    return settings.length > 0 && settings[0].value === 'true';
  }

  async getConfig() {
    const db = await this._getDb();
    const rows = await db.getRows('SELECT key, value FROM settings');
    return Object.fromEntries(rows.map(r => [r.key, r.value]));
  }

  async saveConfig(data) {
    const db = await this._getDb();
    for (const [key, value] of Object.entries(data)) {
      await db.execute(
        'INSERT INTO settings (key, value, description) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
        [key, String(value), 'User config']
      );
    }
    return data;
  }

  // ==================== Providers ====================
  async listProviders() {
    const db = await this._getDb();
    const rows = await db.getRows('SELECT id, nome, tipo, endpoint, ativo, config FROM providers ORDER BY created_at DESC');
    return rows.map(r => ({
      id: r.id,
      nome: r.nome,
      tipo: r.tipo,
      endpoint: r.endpoint,
      ativo: !!r.ativo,
      config: r.config ? JSON.parse(r.config) : {}
    }));
  }

  async createProvider(data) {
    const db = await this._getDb();
    const id = db.generateId('prov_');
    const config = data.config ? JSON.stringify(data.config) : null;
    await db.execute(
      'INSERT INTO providers (id, nome, tipo, api_key, endpoint, ativo, config) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, data.nome, data.tipo, data.api_key, data.endpoint, data.ativo !== false ? 1 : 0, config]
    );
    return { id, nome: data.nome, tipo: data.tipo, endpoint: data.endpoint, ativo: data.ativo !== false };
  }

  async updateProvider(id, data) {
    const db = await this._getDb();
    const config = data.config ? JSON.stringify(data.config) : null;
    await db.execute(
      'UPDATE providers SET nome = ?, tipo = ?, endpoint = ?, ativo = ?, config = ? WHERE id = ?',
      [data.nome, data.tipo, data.endpoint, data.ativo ? 1 : 0, config, id]
    );
    return { id, ...data };
  }

  async deleteProvider(id) {
    const db = await this._getDb();
    await db.execute('DELETE FROM providers WHERE id = ?', [id]);
    return { id, deleted: true };
  }

  // ==================== Templates ====================
  async listTemplates() {
    const db = await this._getDb();
    const rows = await db.getRows('SELECT id, nome, descricao, tipo, provedores, config, ativo, created_at FROM templates ORDER BY created_at DESC');
    return rows.map(r => ({
      id: r.id,
      nome: r.nome,
      descricao: r.descricao,
      tipo: r.tipo,
      provedores: r.provedores ? JSON.parse(r.provedores) : [],
      config: r.config ? JSON.parse(r.config) : {},
      ativo: !!r.ativo,
      createdAt: r.created_at
    }));
  }

  async getTemplate(id) {
    const db = await this._getDb();
    const row = await db.getRow('SELECT id, nome, descricao, tipo, provedores, config, ativo, created_at FROM templates WHERE id = ?', [id]);
    if (!row) return null;
    return {
      id: row.id,
      nome: row.nome,
      descricao: row.descricao,
      tipo: row.tipo,
      provedores: row.provedores ? JSON.parse(row.provedores) : [],
      config: row.config ? JSON.parse(row.config) : {},
      ativo: !!row.ativo,
      createdAt: row.created_at
    };
  }

  async createTemplate(data) {
    const db = await this._getDb();
    const id = db.generateId('tmpl_');
    const provedores = data.provedores ? JSON.stringify(data.provedores) : null;
    const config = data.config ? JSON.stringify(data.config) : null;
    await db.execute(
      'INSERT INTO templates (id, nome, descricao, tipo, provedores, config, ativo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, data.nome, data.descricao, data.tipo, provedores, config, data.ativo !== false ? 1 : 0]
    );
    return { id, nome: data.nome, descricao: data.descricao, tipo: data.tipo, provedores: data.provedores, ativo: data.ativo !== false };
  }

  async updateTemplate(id, data) {
    const db = await this._getDb();
    await db.execute(
      'UPDATE templates SET nome = ?, descricao = ?, tipo = ?, provedores = ?, config = ?, ativo = ? WHERE id = ?',
      [data.nome, data.descricao, data.tipo, data.provedores ? JSON.stringify(data.provedores) : null, data.config ? JSON.stringify(data.config) : null, data.ativo ? 1 : 0, id]
    );
    return { id, ...data };
  }

  async deleteTemplate(id) {
    const db = await this._getDb();
    await db.execute('DELETE FROM templates WHERE id = ?', [id]);
    return { id, deleted: true };
  }

  // ==================== Executions (from productions table) ====================
  async listExecutions(limit = 50) {
    const db = await this._getDb();
    const rows = await db.getRows(
      'SELECT id, template_id, nome as template, status, assets, timeline, scheduled_publish_time, priority, created_at FROM productions ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    return rows.map(r => ({
      id: r.id,
      template_id: r.template_id,
      template: r.template || r.template_id || '—',
      status: STATUS_MAP[r.status] || r.status,
      statusRaw: r.status,
      assets: r.assets ? JSON.parse(r.assets) : {},
      timeline: r.timeline ? JSON.parse(r.timeline) : {},
      scheduledPublishTime: r.scheduled_publish_time,
      priority: r.priority,
      timestamp: r.created_at
    }));
  }

  async getExecution(id) {
    const db = await this._getDb();
    const row = await db.getRow(
      'SELECT id, template_id, nome as template, status, assets, timeline, scheduled_publish_time, priority, created_at FROM productions WHERE id = ?',
      [id]
    );
    if (!row) return null;
    return {
      id: row.id,
      template_id: row.template_id,
      template: row.template || row.template_id || '—',
      status: STATUS_MAP[row.status] || row.status,
      statusRaw: row.status,
      assets: row.assets ? JSON.parse(row.assets) : {},
      timeline: row.timeline ? JSON.parse(row.timeline) : {},
      scheduledPublishTime: row.scheduled_publish_time,
      priority: row.priority,
      timestamp: row.created_at
    };
  }

  async createExecution(data) {
    const db = await this._getDb();
    const id = db.generateId('exec_');
    const now = new Date().toISOString();
    const assets = data.assets ? JSON.stringify(data.assets) : JSON.stringify({});
    const timeline = data.timeline ? JSON.stringify(data.timeline) : JSON.stringify({});
    const nome = data.template || data.nome || 'Execução';

    await db.execute(
      'INSERT INTO productions (id, status, assets, timeline, scheduled_publish_time, priority, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, 'processing', assets, timeline, data.scheduledPublishTime || null, data.priority || 50, now]
    );

    return { id, template: nome, status: 'running', timestamp: now };
  }

  async cancelExecution(id) {
    const db = await this._getDb();
    await db.execute('UPDATE productions SET status = ? WHERE id = ?', ['cancelado', id]);
    return { id, status: 'cancelled', cancelado: true };
  }

  // Also support the /api/execute POST endpoint (alias for createExecution)
  async startExecution(data) {
    return await this.createExecution(data);
  }

  // ==================== Logs ====================
  async listLogs(filtros = {}, limit = 100) {
    const db = await this._getDb();
    let query = 'SELECT id, nivel, servico, mensagem, dados, created_at FROM logs';
    const params = [];
    const conditions = [];

    if (filtros.nivel) { conditions.push('nivel = ?'); params.push(filtros.nivel); }
    if (filtros.servico) { conditions.push('servico = ?'); params.push(filtros.servico); }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    const rows = await db.getRows(query, params);
    return rows.map(r => ({
      id: r.id,
      nivel: r.nivel,
      servico: r.servico,
      mensagem: r.mensagem,
      dados: r.dados ? JSON.parse(r.dados) : {},
      createdAt: r.created_at
    }));
  }

  async addLog(log, _executionId = null) {
    const db = await this._getDb();
    const id = db.generateId('log_');
    const dados = log.dados ? JSON.stringify(log.dados) : null;
    await db.execute(
      'INSERT INTO logs (id, nivel, servico, mensagem, dados, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, log.nivel || 'info', log.servico || 'system', log.mensagem || '', dados, new Date().toISOString()]
    );
    return { id, ...log };
  }

  // ==================== Costs ====================
  async addCostLog(cost) {
    const db = await this._getDb();
    const id = db.generateId('cost_');
    await db.execute(
      'INSERT INTO cost_logs (id, provedor, tipo, custo, moeda, quantia, dados, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, cost.provedor || 'unknown', cost.tipo || 'api', cost.custo || 0, cost.moeda || 'USD', cost.quantia || 1, cost.dados ? JSON.stringify(cost.dados) : null, new Date().toISOString()]
    );
    return { id, ...cost };
  }

  async getCosts(periodo = 'diario') {
    const db = await this._getDb();
    let dateClause = '';

    if (periodo === 'hoje') {
      dateClause = "WHERE date(created_at) = date('now')";
    } else if (periodo === 'semana') {
      dateClause = "WHERE date(created_at) >= date('now', '-7 days')";
    } else if (periodo === 'mes') {
      dateClause = "WHERE date(created_at) >= date('now', '-30 days')";
    }

    const rows = await db.getRows(
      `SELECT id, provedor, tipo, custo, moeda, quantia, dados, created_at FROM cost_logs ${dateClause} ORDER BY created_at DESC`,
      []
    );
    return rows.map(r => ({
      id: r.id,
      provedor: r.provedor,
      tipo: r.tipo,
      custo: r.custo,
      moeda: r.moeda,
      quantia: r.quantia,
      dados: r.dados ? JSON.parse(r.dados) : {},
      createdAt: r.created_at
    }));
  }

  async updateExecution(id, data) {
    const db = await this._getDb();
    const existing = await this.getExecution(id);
    if (!existing) return null;

    const status = data.status || existing.statusRaw || 'processing';
    const assets = data.assets ? JSON.stringify(data.assets) : JSON.stringify(existing.assets || {});
    const timeline = data.timeline ? JSON.stringify(data.timeline) : JSON.stringify(existing.timeline || {});
    
    await db.execute(
      'UPDATE productions SET status = ?, assets = ?, timeline = ? WHERE id = ?',
      [status, assets, timeline, id]
    );

    return await this.getExecution(id);
  }

  // ==================== Schedules ====================
  async listSchedules() {
    const db = await this._getDb();
    const rows = await db.getRows(
      'SELECT id, production_id, title, publish_time, status, priority, metadata, created_at FROM publish_schedule ORDER BY created_at DESC'
    );
    return rows.map(r => ({
      id: r.id,
      production_id: r.production_id,
      title: r.title,
      publish_time: r.publish_time,
      publishTime: r.publish_time,
      status: r.status,
      priority: r.priority,
      metadata: r.metadata ? JSON.parse(r.metadata) : {},
      createdAt: r.created_at
    }));
  }

  async createSchedule(data) {
    const db = await this._getDb();
    const id = db.generateId('sched_');
    const metadata = data.metadata ? JSON.stringify(data.metadata) : null;
    await db.execute(
      'INSERT INTO publish_schedule (id, production_id, title, publish_time, status, priority, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, data.production_id || null, data.title, data.publish_time || data.publishTime, data.status || 'scheduled', data.priority || 50, metadata]
    );
    return { id, ...data };
  }

  async updateSchedule(id, data) {
    const db = await this._getDb();
    await db.execute(
      'UPDATE publish_schedule SET production_id = ?, title = ?, publish_time = ?, status = ?, priority = ?, metadata = ? WHERE id = ?',
      [data.production_id || null, data.title, data.publish_time || data.publishTime, data.status || 'scheduled', data.priority || 50, data.metadata ? JSON.stringify(data.metadata) : null, id]
    );
    return { id, ...data };
  }

  async deleteSchedule(id) {
    const db = await this._getDb();
    await db.execute('DELETE FROM publish_schedule WHERE id = ?', [id]);
    return { id, deleted: true };
  }

  // ==================== Memory ====================
  async getMemory(tipo, chave) {
    const db = await this._getDb();
    const row = await db.getRow('SELECT valor, expires_at FROM memories WHERE tipo = ? AND chave = ?', [tipo, chave]);
    if (!row) return null;
    if (row.expires_at && new Date(row.expires_at) < new Date()) return null;
    return row.valor ? JSON.parse(row.valor) : null;
  }

  async setMemory(tipo, chave, valor, expiresAt = null) {
    const db = await this._getDb();
    const id = db.generateId('mem_');
    const valorStr = JSON.stringify(valor);
    await db.execute(
      'INSERT INTO memories (id, tipo, chave, valor, expires_at) VALUES (?, ?, ?, ?, ?)',
      [id, tipo, chave, valorStr, expiresAt]
    );
    return { tipo, chave, valor, expires_at: expiresAt, created_at: new Date().toISOString() };
  }
}

module.exports = { ConfigService };