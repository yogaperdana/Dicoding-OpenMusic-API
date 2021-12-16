const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on('error', (error) => {
      console.log('\x1b[91m[redis] error occured while connecting or accessing redis server\x1b[0m');
      console.error(error);
    });

    this._client.on('reconnecting', () => {
      console.log('\x1b[33m[redis] trying to reconnect to redis server...\x1b[0m');
    });

    this._client.on('connect', () => {
      console.log('\x1b[32m[redis] connecting to redis server...\x1b[0m');
    });

    this._client.on('ready', () => {
      console.log('\x1b[92m[redis] redis client connected\x1b[0m');
    });

    this._client.connect();
  }

  async set(key, value, expirationInSecond = 3600) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new Error('Cache tidak ditemukan');

    return result;
  }

  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
