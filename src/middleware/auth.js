const auth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const configuredKey = process.env.API_KEY;

  if (!configuredKey) return next();

  if (!apiKey || apiKey !== configuredKey) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'API key inválida ou ausente' }
    });
  }

  next();
};

module.exports = auth;
