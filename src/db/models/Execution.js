const mongoose = require('mongoose');

const executionSchema = new mongoose.Schema({
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
  faseAtual: { type: String, default: 'inicio' },
  status: { type: String, enum: ['pendente', 'executando', 'concluido', 'falha', 'cancelado'], default: 'pendente' },
  progresso: { type: Number, default: 0 },
  fases: [{
    nome: { type: String, required: true },
    status: { type: String, enum: ['pendente', 'executando', 'concluido', 'falha'], default: 'pendente' },
    inicio: { type: Date },
    fim: { type: Date },
    erro: { type: String },
    tentativas: { type: Number, default: 0 }
  }],
  resultado: { type: mongoose.Schema.Types.Mixed },
  erro: { type: String },
  cancelado: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

executionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Execution', executionSchema);
