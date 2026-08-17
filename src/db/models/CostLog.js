const mongoose = require('mongoose');

const costLogSchema = new mongoose.Schema({
  provider: { type: String, required: true },
  servico: { type: String, required: true },
  custo: { type: Number, required: true },
  moeda: { type: String, default: 'USD' },
  execution: { type: mongoose.Schema.Types.ObjectId, ref: 'Execution' },
  data: { type: Date, default: Date.now }
});

costLogSchema.index({ provider: 1, data: -1 });

module.exports = mongoose.model('CostLog', costLogSchema);
