'use strict'

const redis = require('redis')
const { promisify } = require('util')
const worker = require('../../dist/worker')

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

worker.create({
  cache: (client => ({
    get: promisify(client.get).bind(client),
    expire: promisify(client.expire).bind(client),
    set: promisify(client.set).bind(client),
    del: promisify(client.del).bind(client),
    hset: promisify(client.hset).bind(client),
    sadd: promisify(client.sadd).bind(client)
  }))(redis.createClient(redisUrl)),
  google: {
    credentials: require('../../secrets/serviceAccount'),
    rootFolderId:
      process.env.GOOGLE_ROOT_FOLDER_ID || '1NOoENRo_i1eqb43d_aVJgV7NezCXLc3k'
  },
  queue: {
    consumer: (client => ({
      blpop: promisify(client.blpop).bind(client)
    }))(redis.createClient(redisUrl))
  }
})
