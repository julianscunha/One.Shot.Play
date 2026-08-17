const ConfigModel = require('../db/models/Config');
const ProviderModel = require('../db/models/Provider');
const TemplateModel = require('../db/models/Template');
const ScheduleModel = require('../db/models/Schedule');
const ExecutionModel = require('../db/models/Execution');
const LogModel = require('../db/models/Log');
const CostLogModel = require('../db/models/CostLog');
const MemoryModel = require('../db/models/Memory');

class ConfigService {
  async isSystemConfigured() {
    const config = await ConfigModel.findOne({ key: 'system' });
    return !!config;
  }

  async getConfig() {
    const config = await ConfigModel.findOne({ key: 'system' });
    return config?.value || {};
  }

  async saveConfig(data) {
    return await ConfigModel.findOneAndUpdate(
      { key: 'system' },
      { key: 'system', value: data, updatedAt: new Date() },
      { upsert: true, new: true }
    );
  }

  async listProviders() {
    return await ProviderModel.find({});
  }

  async createProvider(data) {
    const provider = new ProviderModel(data);
    return await provider.save();
  }

  async updateProvider(id, data) {
    return await ProviderModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProvider(id) {
    return await ProviderModel.findByIdAndDelete(id);
  }

  async listTemplates() {
    return await TemplateModel.find({ ativo: true }).populate('provedores.ai provedores.tts provedores.image provedores.video');
  }

  async getTemplate(id) {
    return await TemplateModel.findById(id).populate('provedores.ai provedores.tts provedores.image provedores.video');
  }

  async createTemplate(data) {
    const template = new TemplateModel(data);
    return await template.save();
  }

  async updateTemplate(id, data) {
    return await TemplateModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteTemplate(id) {
    return await TemplateModel.findByIdAndUpdate(id, { ativo: false }, { new: true });
  }

  async listSchedules() {
    return await ScheduleModel.find({}).populate('template').sort({ createdAt: -1 });
  }

  async createSchedule(data) {
    const schedule = new ScheduleModel(data);
    return await schedule.save();
  }

  async updateSchedule(id, data) {
    return await ScheduleModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteSchedule(id) {
    return await ScheduleModel.findByIdAndUpdate(id, { ativo: false }, { new: true });
  }

  async listExecutions(limit = 50) {
    return await ExecutionModel.find({}).sort({ createdAt: -1 }).limit(limit).populate('template');
  }

  async getExecution(id) {
    return await ExecutionModel.findById(id).populate('template');
  }

  async createExecution(data) {
    const execution = new ExecutionModel(data);
    return await execution.save();
  }

  async updateExecution(id, data) {
    return await ExecutionModel.findByIdAndUpdate(id, data, { new: true });
  }

  async cancelExecution(id) {
    return await ExecutionModel.findByIdAndUpdate(id, { cancelado: true, status: 'cancelado' }, { new: true });
  }

  async addLog(log) {
    return await LogModel.create(log);
  }

  async listLogs(filtros = {}, limit = 100) {
    const query = {};
    if (filtros.nivel) query.nivel = filtros.nivel;
    if (filtros.servico) query.servico = filtros.servico;
    return await LogModel.find(query).sort({ createdAt: -1 }).limit(limit);
  }

  async addCostLog(cost) {
    return await CostLogModel.create(cost);
  }

  async getCosts(periodo) {
    const dataInicio = new Date();
    if (periodo === 'diario') dataInicio.setDate(dataInicio.getDate() - 1);
    else if (periodo === 'semanal') dataInicio.setDate(dataInicio.getDate() - 7);
    else if (periodo === 'mensal') dataInicio.setMonth(dataInicio.getMonth() - 1);

    return await CostLogModel.find({ data: { $gte: dataInicio } });
  }

  async getMemory(tipo, chave) {
    return await MemoryModel.findOne({ tipo, chave });
  }

  async setMemory(tipo, chave, valor, expiresAt) {
    return await MemoryModel.findOneAndUpdate(
      { tipo, chave },
      { tipo, chave, valor, expiresAt },
      { upsert: true, new: true }
    );
  }
}

module.exports = { ConfigService };
