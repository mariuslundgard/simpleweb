'use strict'

const compression = require('compression')
const express = require('express')
const path = require('path')
const redis = require('redis')
const { promisify } = require('util')
const createServer = require('../../dist/server').create

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

const config = {
  graphiql: false,
  google: {
    credentials: require('../../secrets/serviceAccount')
  },
  cache: (client => ({
    get: promisify(client.get).bind(client),
    expire: promisify(client.expire).bind(client),
    set: promisify(client.set).bind(client),
    del: promisify(client.del).bind(client),
    hset: promisify(client.hset).bind(client),
    sadd: promisify(client.sadd).bind(client)
  }))(redis.createClient(redisUrl)),
  manifest: {
    'app.js': 'app.js'
  },
  queue: {
    producer: (client => ({
      rpush: promisify(client.rpush).bind(client)
    }))(redis.createClient(redisUrl))
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
