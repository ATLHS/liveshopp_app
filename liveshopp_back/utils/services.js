const { log } = require('../middleware/logger');
const { mongoose } = require('mongoose');
const { createClient } = require('redis');

// Register service helper
// Stores instances in `global` to prevent memory leaks in development
const registerService = (name, initFn) => {
  if (process.env.NODE_ENV === 'development') {
    if (!(name in global)) {
      global[name] = initFn();
    }
    return global[name];
  }
  return initFn();
};

registerService('mongoose', () => {
  mongoose
    .connect(process.env.ATLAS_URL)
    .then(() => log.info(`Mongoose connected successfully`))
    .catch((err) => log.error('Mongoose Error', err));
});

/**
 * @type {import('redis').RedisClientType}
 */
const redis = registerService('redis', () => {
  const client = createClient({
    url: process.env.REDIS_URL,
    connectTimeout: 10000, // in milliseconds
  })
    .on('error', (err) => log.error('Redis Client Error', err))
    .on('connect', () => log.info('Redis connected successfully'))
    .on('connection', (stream) => {
      log.info('someone connected!');
      log.info(stream);
    });

  client.connect();

  return client;
});

module.exports = { redis };
