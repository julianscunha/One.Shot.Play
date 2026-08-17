const ERROR_TYPES = {
  TRANSIENT: 'TRANSIENT',
  FATAL: 'FATAL'
};

const classifyError = (error) => {
  if (!error) return ERROR_TYPES.TRANSIENT;

  const transientCodes = [
    'ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND',
    '429', '500', '502', '503', '504',
    'network_error', 'timeout', 'rate_limit'
  ];

  const message = error.message?.toLowerCase() || '';
  const code = error.code?.toLowerCase() || '';
  const status = error.status?.toString() || '';

  const isTransient = transientCodes.some(t =>
    message.includes(t) || code.includes(t) || status.includes(t)
  );

  return isTransient ? ERROR_TYPES.TRANSIENT : ERROR_TYPES.FATAL;
};

const isRetryable = (error) => classifyError(error) === ERROR_TYPES.TRANSIENT;

module.exports = { ERROR_TYPES, classifyError, isRetryable };
