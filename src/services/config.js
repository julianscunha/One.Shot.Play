const { createLogger } = require('../utils/logger');

const logger = createLogger('ConfigService');

class ConfigService {
  async isSystemConfigured() {
    return true;
  }

  async getConfig() {
    return {};
  }

  async saveConfig(data) {
    return data;
  }

  async listProviders() {
    return [];
  }

  async createProvider(data) {
    return { id: '1', ...data };
  }

  async updateProvider(id, data) {
    return { id, ...data };
  }

  async deleteProvider(id) {
    return { id, deleted: true };
  }

  async listTemplates() {
    return [];
  }

  async getTemplate(id) {
    return null;
  }

  async createTemplate(data) {
    return { id: '1', ...data };
  }

  async updateTemplate(id, data) {
    return { id, ...data };
  }

  async deleteTemplate(id) {
    return { id, deleted: true };
  }

  async listSchedules() {
    return [];
  }

  async createSchedule(data) {
    return { id: '1', ...data };
  }

  async updateSchedule(id, data) {
    return { id, ...data };
  }

  async getExecution(id) {
    return null;
  }

  async createExecution(data) {
    return { id: '1', ...data };
  }

  async updateExecution(id, data) {
    return { id, ...data };
  }

  async cancelExecution(id) {
    return { id, status: 'cancelado', cancelado: true };
  }

  async addLog(log, executionId = null) {
    return { id: '1', ...log };
  }

  async listLogs(filtros = {}, limit = 100) {
    return [];
  }

  async addCostLog(cost) {
    return { id: '1', ...cost };
  }

  async getCosts(periodo) {
    return [];
  }

  async getMemory(tipo, chave) {
    return null;
  }

  async setMemory(tipo, chave, valor, expiresAt) {
    return { tipo, chave, valor, expires_at: expiresAt, created_at: new Date().toISOString() };
  }
}

module.exports = { ConfigService };