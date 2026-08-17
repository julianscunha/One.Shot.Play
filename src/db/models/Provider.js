const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { type: String, required: true, enum: ['ai', 'tts', 'image', 'video'] },
  primary: {
    endpoint: { type: String, required: true },
    apiKey: { type: String, required: true },
    timeout: { type: Number, default: 30000 },
    modelo: { type: String }
  },
  fallback: {
    endpoint: { type: String },
    apiKey: { type: String },
    timeout: { type: Number, default: 30000 },
    modelo: { type: String }
  },
  ativo: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Provider', providerSchema);
