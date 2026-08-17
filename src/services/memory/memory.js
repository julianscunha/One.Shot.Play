const { Memory } = require('../db/models/Memory');

class MemoryService {
  async salvar(tipo, chave, valor, ttlMs) {
    const expiresAt = ttlMs ? new Date(Date.now() + ttlMs) : null;
    return await Memory.findOneAndUpdate(
      { tipo, chave },
      { tipo, chave, valor, expiresAt },
      { upsert: true, new: true }
    );
  }

  async obter(tipo, chave) {
    const memoria = await Memory.findOne({ tipo, chave });
    if (!memoria) return null;

    if (memoria.expiresAt && memoria.expiresAt < new Date()) {
      await Memory.deleteOne({ _id: memoria._id });
      return null;
    }

    return memoria.valor;
  }

  async listarPorTipo(tipo) {
    return await Memory.find({ tipo });
  }

  async limparExpirados() {
    return await Memory.deleteMany({ expiresAt: { $lt: new Date() } });
  }
}

module.exports = { MemoryService };
