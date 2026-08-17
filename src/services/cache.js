const { Memory } = require('../db/models/Memory');

class CacheService {
  async get(chave) {
    const memoria = await Memory.findOne({ tipo: 'cache', chave });
    if (!memoria) return null;

    if (memoria.expiresAt && memoria.expiresAt < new Date()) {
      await Memory.deleteOne({ _id: memoria._id });
      return null;
    }

    return memoria.valor;
  }

  async set(chave, valor, ttlMs) {
    const expiresAt = ttlMs ? new Date(Date.now() + ttlMs) : null;
    return await Memory.findOneAndUpdate(
      { tipo: 'cache', chave },
      { tipo: 'cache', chave, valor, expiresAt },
      { upsert: true, new: true }
    );
  }

  async invalidate(chave) {
    await Memory.deleteOne({ tipo: 'cache', chave });
  }

  async clear() {
    await Memory.deleteMany({ tipo: 'cache' });
  }
}

module.exports = { CacheService };
