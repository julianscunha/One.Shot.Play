// Error classification utilities
const ERROR_TYPES = {
  NETWORK_ERROR: 'network_error',
  TIMEOUT_ERROR: 'timeout_error',
  VALIDATION_ERROR: 'validation_error',
  AUTH_ERROR: 'auth_error',
  RATE_LIMIT_ERROR: 'rate_limit_error',
  TRANSIENT: 'transient',
  FATAL: 'fatal'
};

function isRetryable(error) {
  if (!error) return false;
  
  const errorCode = error.code;
  const errorMessage = error.message || '';
  
  const transientErrors = [
    'ECONNRESET',
    'ENOTFOUND', 
    'ENETDOWN',
    'ETIMEDOUT',
    'ECONNREFUSED',
    'EHOSTUNREACH'
  ];
  
  const fatalErrors = [
    'EACCESSPEROMITTED',
    'EINVALIDARG',
    'AUTHENTICATION_FAILED',
    'INVALID_CREDENTIALS',
    'CREDENTIALS_EXPIRED',
    'PERMISSION_DENIED'
  ];
  
  if (transientErrors.includes(errorCode)) {
    return true;
  }
  
  if (fatalErrors.includes(errorCode)) {
    return false;
  }
  
  const message = errorMessage.toLowerCase();
  
  const transientPatterns = [
    'network error',
    'connection timeout',
    'service unavailable',
    'rate limit exceeded',
    'temporary failure',
    'try again later'
  ];
  
  const fatalPatterns = [
    'invalid api key',
    'authentication failed',
    'permission denied',
    'not authorized',
    'forbidden',
    'unauthorized'
  ];
  
  const hasTransientPattern = transientPatterns.some(pattern => 
    message.includes(pattern)
  );
  
  const hasFatalPattern = fatalPatterns.some(pattern => 
    message.includes(pattern)
  );
  
  if (hasFatalPattern) return false;
  if (hasTransientPattern) return true;
  
  return false;
}

function classifyError(error) {
  if (!error) return ERROR_TYPES.VALIDATION_ERROR;
  
  const errorCode = error.code;
  const errorMessage = error.message || '';
  
  // ECONNRESET should be TRANSIENT for backward compatibility
  if (errorCode === 'ECONNRESET') {
    return ERROR_TYPES.TRANSIENT;
  }
  
  if (errorCode && errorCode.includes('ECONNRESET')) {
    return ERROR_TYPES.NETWORK_ERROR;
  }
  
  if (errorCode && errorCode.includes('ETIMEDOUT')) {
    return ERROR_TYPES.TIMEOUT_ERROR;
  }
  
  if (errorCode && errorCode.includes('EACCESSPEROMITTED')) {
    return ERROR_TYPES.AUTH_ERROR;
  }
  
  const message = errorMessage.toLowerCase();
  
  if (message.includes('api key') || message.includes('credential')) {
    return ERROR_TYPES.FATAL;
  }
  
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return ERROR_TYPES.RATE_LIMIT_ERROR;
  }
  
  return ERROR_TYPES.TRANSIENT;
}

module.exports = {
  ERROR_TYPES,
  isRetryable,
  classifyError
};