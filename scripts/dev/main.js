'use strict'

require('dotenv').config()

const path = require('path')

const sourcePath = path.resolve(__dirname, '../../src')
require('babel-register')({
  only: sourcePath
})

const chokidar = require('chokidar')
const express = require('express')
const pino = require('pino')
const redis = require('redis')
const request = require('request')
const rollup = require('rollup')
const { promisify } = require('util')
const postcss = require('./lib/postcss')
const clientConfig = require('../../.rollup/client.config')
const serverPath = path.resolve(sourcePath, 'server')

const { BASE_URL, REDIS_URL } = process.env

const clients = []

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
  graphiql: true,
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
    'app.js': 'app-dev.js',
    'app-down.css': 'app-down.css'
  },
  logger: pino({ name: 'main', prettyPrint: true }),
  queue: {
    producer: (client => ({
      rpush: promisify(client.rpush).bind(client)
    }))(redis.createClient(REDIS_URL))
  }
}

const port = 3000

// Setup client-side watcher
const rollupWatcher = rollup.watch(clientConfig)
rollupWatcher.on('event', evt => {
  switch (evt.code) {
    case 'FATAL':
      config.pino.error(evt.error.stack)
      process.exit(1)

    default:
      clients.forEach(res => {
        res.write(`data: ${JSON.stringify(evt)}\n\n`)
      })
      break
  }
})

function bundleCss () {
  return Promise.all([
    postcss.bundle({
      clients,
      from: path.resolve(sourcePath, 'frontend/client.css'),
      to: path.resolve(__dirname, '../../dist/client/app.css')
    }),
    postcss.bundle({
      clients,
      from: path.resolve(sourcePath, 'frontend/client-down.css'),
      to: path.resolve(__dirname, '../../dist/client/app-down.css')
    })
  ])
}

bundleCss().catch(err => {
  config.pino.error(`CSS ${err.stack}`)
})

// Setup server-side watcher
const watcher = chokidar.watch(sourcePath)
watcher.on('ready', () => {
  watcher.on('all', (type, file) => {
    if (file && file.endsWith('.css')) {
      bundleCss()
        .then(() => {
          clients.forEach(res => {
            res.write(`data: ${JSON.stringify({ code: 'CSS_BUNDLE_END' })}\n\n`)
          })
        })
        .catch(err => {
          config.pino.error(`CSS ${err.stack}`)
        })
    } else {
      Object.keys(require.cache)
        .filter(key => key.startsWith(sourcePath))
        .forEach(key => {
          delete require.cache[key]
        })
    }
  })
})

// Setup HTTP server
const app = express()

app.get('/dev', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  })

  clients.push(res)

  req.addListener('close', () => {
    clients.splice(clients.indexOf(res), 1)
  })
})

app.use(express.static(path.resolve(__dirname, '../../dist/client')))

app.use((req, res, next) => {
  require(serverPath).create(config)(req, res, next)
})

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500)
  res.send(`<h1>Something went wrong!</h1><pre>${err.stack}</pre>`)
  next()
})

// Start HTTP server
app.listen(port, err => {
  if (err) {
    // stop watching
    rollupWatcher.close()
    config.logger.error(err)
    process.exit(1)
  } else {
    console.log('┌──────────────────────────────────────────────────┐')
    console.log(`│ The server is listening at http://localhost:${port} │`)
    console.log('└──────────────────────────────────────────────────┘\n')
  }
})
