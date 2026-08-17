const { ERROR_TYPES, classifyError } = require('./errors');

module.exports = (error, req, res, next) => {
  const tipo = classifyError(error);
  const status = error.status || 500;

  logger.error(`${req.method} ${req.path}`, {
    error: error.message,
    type: tipo,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });

  res.status(status).json({
    error: {
      code: tipo,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
};
