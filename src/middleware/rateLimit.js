const rateLimit = require('express-rate-limit');

const createLimiter = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMIT_EXCEEDED', message } }
});

module.exports = {
  general: createLimiter(15 * 60 * 1000, 100, 'Limite de requisições excedido'),
  auth: createLimiter(15 * 60 * 1000, 10, 'Limite de tentativas de autenticação excedido'),
  publish: createLimiter(60 * 60 * 1000, 5, 'Limite de publicações por hora excedido')
};
