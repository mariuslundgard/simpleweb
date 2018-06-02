'use strict'

const compression = require('compression')
const express = require('express')
const path = require('path')
const config = require('../config')
const createServer = require('../../dist/server').create

const serverHandler = createServer(config)

const port = 3000

// Setup HTTP server
const app = express()

app.disable('x-powered-by')

// Setup middleware
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
  config.logger.error(`Uncaught exception occured: ${err}`)
  process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
  config.logger.error('Unhandled rejection occured:', p, 'reason:', reason)
  process.exit(1)
})
