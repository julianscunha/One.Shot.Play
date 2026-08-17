const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dados inválidos',
          details: result.error.flatten()
        }
      });
    }
    req.body = result.data;
    next();
  };
};

module.exports = validate;
