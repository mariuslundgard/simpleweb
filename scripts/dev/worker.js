'use strict'

require('dotenv').config()

const path = require('path')

const sourcePath = path.resolve(__dirname, '../../src')
require('babel-register')({
  only: sourcePath
})

const chokidar = require('chokidar')
const redis = require('redis')
const { promisify } = require('util')
const worker = require('../../src/worker').default

const { GOOGLE_ROOT_FOLDER_ID, REDIS_URL } = process.env

// Setup server-side watcher
const watcher = chokidar.watch(sourcePath)
watcher.on('ready', () => {
  watcher.on('all', () => {
    process.exit(0)
  })
})

worker.create({
  cache: (client => ({
    get: promisify(client.get).bind(client),
    expire: promisify(client.expire).bind(client),
    set: promisify(client.set).bind(client),
    del: promisify(client.del).bind(client),
    hset: promisify(client.hset).bind(client),
    sadd: promisify(client.sadd).bind(client)
  }))(redis.createClient(REDIS_URL)),
  google: {
    credentials: require('../../secrets/serviceAccount'),
    rootFolderId: GOOGLE_ROOT_FOLDER_ID
  },
  queue: {
    consumer: (client => ({
      blpop: promisify(client.blpop).bind(client)
    }))(redis.createClient(REDIS_URL))
  }
})
