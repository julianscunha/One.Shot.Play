const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  nivel: { type: String, enum: ['debug', 'info', 'warn', 'error'], required: true },
  servico: { type: String, required: true },
  mensagem: { type: String, required: true },
  detalhes: { type: mongoose.Schema.Types.Mixed },
  execution: { type: mongoose.Schema.Types.ObjectId, ref: 'Execution' },
  createdAt: { type: Date, default: Date.now, expires: '7d' }
});

logSchema.index({ servico: 1, createdAt: -1 });
logSchema.index({ nivel: 1, createdAt: -1 });

module.exports = mongoose.model('Log', logSchema);
