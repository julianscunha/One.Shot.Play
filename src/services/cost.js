const { ConfigService } = require('../services/config');

class CostService {
  constructor() {
    this.configService = new ConfigService();
  }

  async calcularCusto(execucao) {
    const custos = {
      ai: 0.001,
      tts: 0.005,
      image: 0.01,
      video: 0.05
    };

    const total = Object.entries(custos).reduce((sum, [servico, custo]) => {
      return sum + custo;
    }, 0);

    return total;
  }

  async verificarLimite() {
    const custos = await this.configService.getCosts('diario');
    const total = custos.reduce((sum, c) => sum + c.custo, 0);
    const limite = parseFloat(process.env.CUSTO_LIMITE_DIARIO || 1);

    return {
      total,
      limite,
      atingido: total >= limite,
      percentual: Math.min((total / limite) * 100, 100)
    };
  }

  async registrarCusto(provider, servico, custo, executionId) {
    await this.configService.addCostLog({
      provider,
      servico,
      custo,
      execution: executionId
    });
  }
}

module.exports = { CostService };
