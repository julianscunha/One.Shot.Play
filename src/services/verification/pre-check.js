const { ConfigService } = require('../services/config');

class PreCheckService {
  constructor() {
    this.configService = new ConfigService();
  }

  async verificar(executionId, template) {
    const verificacoes = [];

    verificacoes.push(await this.verificarConfiguracao(template));
    verificacoes.push(await this.verificarProvedores(template));
    verificacoes.push(await this.verificarLimiteCusto());

    const falhas = verificacoes.filter(v => !v.sucesso);
    if (falhas.length > 0) {
      throw new Error(`Verificação pré-execução falhou: ${falhas.map(f => f.mensagem).join(', ')}`);
    }

    return { sucesso: true, verificacoes };
  }

  async verificarConfiguracao(template) {
    if (!template) {
      return { sucesso: false, mensagem: 'Template não informado' };
    }
    return { sucesso: true, mensagem: 'Template válido' };
  }

  async verificarProvedores(template) {
    if (!template.provedores) {
      return { sucesso: false, mensagem: 'Provedores não configurados no template' };
    }
    return { sucesso: true, mensagem: 'Provedores configurados' };
  }

  async verificarLimiteCusto() {
    const custos = await this.configService.getCosts('diario');
    const total = custos.reduce((sum, c) => sum + c.custo, 0);
    const limite = parseFloat(process.env.CUSTO_LIMITE_DIARIO || 1);

    if (total >= limite) {
      return { sucesso: false, mensagem: `Limite de custo diário atingido: $${total.toFixed(2)} / $${limite}` };
    }

    return { sucesso: true, mensagem: `Custo dentro do limite: $${total.toFixed(2)} / $${limite}` };
  }
}

module.exports = { PreCheckService };
