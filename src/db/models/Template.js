const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { type: String, required: true, enum: ['infantil', 'educacional', 'musical', 'cartoon', 'relaxante', 'aleatorio'] },
  canal: { type: String, required: true },
  publico: { type: String, required: true },
  idioma: { type: String, required: true, enum: ['pt-BR', 'en-US'], default: 'pt-BR' },
  qualidade: { type: String, enum: ['baixa', 'media', 'alta'], default: 'media' },
  resolucao: { type: String, enum: ['720p', '1080p', '4k'], default: '1080p' },
  duracao: { type: Number, enum: [1, 3, 5, 7], default: 3 },
  narracao: { type: Boolean, default: true },
  voz: { type: String, enum: ['masculina', 'feminina'], default: 'feminina' },
  musica: { type: String, enum: ['aleatoria', 'tema', 'nenhuma'], default: 'tema' },
  legenda: { type: Boolean, default: true },
  corLegenda: { type: String, default: '#ffffff' },
  classificacao: { type: String, enum: ['Livre', '10+', '12+', '14+', '16+', '18+'], default: 'Livre' },
  provedores: [{
    ai: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    tts: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' }
  }],
  configuracoes: { type: mongoose.Schema.Types.Mixed, default: {} },
  ativo: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

templateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Template', templateSchema);
