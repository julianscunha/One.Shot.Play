class RetryError extends Error {
  constructor(message, attempts, lastError) {
    super(message);
    this.attempts = attempts;
    this.lastError = lastError;
  }
}

const retry = async (fn, options = {}) => {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    factor = 2,
    shouldRetry = () => true
  } = options;

  let attempts = 0;
  let delay = initialDelay;

  while (attempts < maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      attempts++;
      if (!shouldRetry(error) || attempts >= maxAttempts) {
        throw new RetryError(`Falha após ${attempts} tentativas`, attempts, error);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * factor, maxDelay);
    }
  }
};

module.exports = { retry, RetryError };
