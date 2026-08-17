const cors = require('cors');

module.exports = cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3456',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
});
