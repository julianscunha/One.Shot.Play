// Helper functions for database retry logic
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class RetryError extends Error {
  constructor(message, attempt, maxAttempts, lastError) {
    super(message);
    this.name = 'RetryError';
    this.attempt = attempt;
    this.maxAttempts = maxAttempts;
    this.lastError = lastError;
  }
}

async function retry(operation, options = {}) {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    factor = 2,
    shouldRetry = (error) => true,
    onRetry = () => {}
  } = options;

  let attempt = 1;
  let lastError;
  let delay = initialDelay;

  while (attempt <= maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw new RetryError(
          `Operation failed after ${attempt} attempts: ${error.message}`, 
          attempt, 
          maxAttempts, 
          lastError
        );
      }

      onRetry(attempt, error, delay);
      await sleep(delay);
      delay *= factor;
      attempt++;
    }
  }

  throw new RetryError(
    `Operation failed after ${attempt} attempts`, 
    attempt, 
    maxAttempts, 
    lastError
  );
}

module.exports = {
  retry,
  RetryError
};