'use strict'

require('dotenv').config()

const path = require('path')

const sourcePath = path.resolve(__dirname, '../../src')
require('babel-register')({
  only: sourcePath
})

const chokidar = require('chokidar')
const express = require('express')
const rollup = require('rollup')
const buildConfig = require('../../src/frontend/build.config')
const clientConfig = require('../../.rollup/client.config')
const postcss = require('../lib/postcss')
const config = require('../config')

const serverPath = path.resolve(sourcePath, 'server')

const clients = []

const port = 3000

// Setup client-side watcher
const rollupWatcher = rollup.watch(clientConfig)
rollupWatcher.on('event', evt => {
  switch (evt.code) {
    case 'FATAL':
      if (evt && evt.error) {
        config.logger.error(evt.error.stack)
      }
      process.exit(1)

    default:
      clients.forEach(res => {
        res.write(`data: ${JSON.stringify(evt)}\n\n`)
      })
      break
  }
})

function bundleCss () {
  return Promise.all(
    buildConfig.css.map(cssConfig => postcss.bundle(cssConfig))
  )
}

bundleCss().catch(err => {
  if (err) {
    config.logger.error(`CSS ${err.stack}`)
  }
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
          config.logger.error(`CSS ${err.stack}`)
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
  res.status(err.status || 500)
  res.send(
    [
      `<h1>Something went wrong!</h1>`,
      `<pre>${err.stack}</pre>`,
      err.errors && `<pre>${JSON.stringify(err.errors, null, 2)}</pre>`
    ]
      .filter(Boolean)
      .join('')
  )
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
    console.log('┌────────────────────────────────────────────────┐')
    console.log(`│ The server is listening at ${config.baseUrl} │`)
    console.log('└────────────────────────────────────────────────┘\n')
  }
})
