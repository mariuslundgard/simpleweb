'use strict'

const compression = require('compression')
const express = require('express')
const path = require('path')
const pino = require('pino')
const redis = require('redis')
const request = require('request')
const { promisify } = require('util')
const createServer = require('../../dist/server').create

const { BASE_URL, REDIS_URL } = process.env

function getFeatureEnv (key, defaultFlag = false) {
  return process.env[`FEATURE_${key}`] === 'on' || defaultFlag
}

const apiClient = {
  query: q => {
    return new Promise((resolve, reject) => {
      request.post(
        {
          url: `http://localhost:3000/api/graphql?query=${q}`
        },
        (err, res, text) => {
          if (err) {
            reject(err)
          } else {
            resolve(JSON.parse(text))
          }
        }
      )
    })
  }
}

const config = {
  apiClient,
  baseUrl: BASE_URL,
  features: {
    live: getFeatureEnv('LIVE')
  },
  graphiql: false,
  google: {
    credentials: require('../../secrets/google-service-account.json')
  },
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
  manifest: {
    'app.css': 'app.css',
    'app.js': 'app.js',
    'app-down.css': 'app-down.css'
  },
  logger: pino({ name: 'main' }),
  queue: {
    producer: (client => ({
      rpush: promisify(client.rpush).bind(client)
    }))(redis.createClient(REDIS_URL))
  }
}

const serverHandler = createServer(config)

const port = 3000

// Setup HTTP server
const app = express()
app.use(compression())
app.use(express.static(path.resolve(__dirname, '../../dist/client')))
app.use(serverHandler)

// Start HTTP server
const server = app.listen(port, err => {
  if (err) {
    console.log(err)
    process.exit(1)
  } else {
    const host = server.address().address
    console.log(`Listening at http://${host}:${port}`)
  }
})

// Log uncaught exceptions and rejections
process.on('uncaughtException', err => {
  console.error(`Uncaught exception occured: ${err}`)
  process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled rejection occured:', p, 'reason:', reason)
  process.exit(1)
})
