const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  chave: { type: String, required: true },
  valor: { type: mongoose.Schema.Types.Mixed, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

memorySchema.index({ tipo: 1, chave: 1 }, { unique: true });
memorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Memory', memorySchema);
