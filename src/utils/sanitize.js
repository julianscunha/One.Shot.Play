const sanitizeHtml = require('sanitize-html');

const sanitize = (input) => {
  if (typeof input !== 'string') return input;

  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {}
  });
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitize(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => sanitizeObject(item));
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

module.exports = { sanitize, sanitizeObject };
