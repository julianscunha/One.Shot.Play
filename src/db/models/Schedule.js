const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
  frequencia: { type: String, enum: ['1x_dia', '2x_dia', '4x_dia', '3x_semana', '1x_semana'], required: true },
  horario: { type: String, required: true },
  diasSemana: [{ type: Number, min: 0, max: 6 }],
  timezone: { type: String, default: 'America/Sao_Paulo' },
  ativo: { type: Boolean, default: true },
  proximaExecucao: { type: Date },
  ultimaExecucao: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
