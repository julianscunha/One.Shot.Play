const axios = require('axios');
const { CacheService } = require('./cache');

const httpPool = new Map();
const cache = new CacheService();

const getClient = async (baseURL) => {
  if (httpPool.has(baseURL)) {
    return httpPool.get(baseURL);
  }

  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' }
  });

  httpPool.set(baseURL, client);
  return client;
};

const request = async (config) => {
  const cacheKey = `${config.method}:${config.url}:${JSON.stringify(config.data || config.params || {})}`;
  const cached = await cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const client = await getClient(config.baseURL);
  const response = await client.request(config);

  await cache.set(cacheKey, response.data, 300000);

  return response.data;
};

module.exports = { request, getClient };
