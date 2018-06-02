'use strict'

require('dotenv').config()

const path = require('path')

const sourcePath = path.resolve(__dirname, '../../src')
require('babel-register')({
  only: sourcePath
})

const chokidar = require('chokidar')
const pino = require('pino')
const redis = require('redis')
const { promisify } = require('util')
const worker = require('../../src/worker').default

const { GOOGLE_ROOT_FOLDER_ID, REDIS_URL } = process.env

// Setup server-side watcher
const watcher = chokidar.watch(sourcePath)
watcher.on('ready', () => {
  watcher.on('all', (type, file) => {
    if (!file && !file.endsWith('.css')) {
      Object.keys(require.cache)
        .filter(key => key.startsWith(sourcePath))
        .forEach(key => {
          delete require.cache[key]
        })
      process.exit(0)
    }
  })
})

function getFeatureEnv (key, defaultFlag = false) {
  return process.env[`FEATURE_${key}`] === 'on' || defaultFlag
}

worker.create({
  cache: (client => ({
    get: promisify(client.get).bind(client),
    expire: promisify(client.expire).bind(client),
    set: promisify(client.set).bind(client),
    del: promisify(client.del).bind(client),
    hset: promisify(client.hset).bind(client),
    sadd: promisify(client.sadd).bind(client),
    srem: promisify(client.srem).bind(client),
    smembers: promisify(client.smembers).bind(client)
  }))(redis.createClient(REDIS_URL)),
  features: {
    live: getFeatureEnv('LIVE')
  },
  google: {
    channelExpiration: 60, // 60 seconds
    credentials: require('../../secrets/google-service-account.json'),
    rootFolderId: GOOGLE_ROOT_FOLDER_ID
  },
  logger: pino({ name: 'worker', prettyPrint: true }),
  queue: {
    consumer: (client => ({
      blpop: promisify(client.blpop).bind(client)
    }))(redis.createClient(REDIS_URL)),
    producer: (client => ({
      rpush: promisify(client.rpush).bind(client)
    }))(redis.createClient(REDIS_URL))
  }
})
