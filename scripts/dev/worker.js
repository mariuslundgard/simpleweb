'use strict'

require('dotenv').config()

const path = require('path')

const sourcePath = path.resolve(__dirname, '../../src')
require('babel-register')({
  only: sourcePath
})

const chokidar = require('chokidar')
const config = require('../config')
const worker = require('../../src/worker').default

// Setup server-side watcher
const watcher = chokidar.watch(sourcePath)
watcher.on('ready', () => {
  watcher.on('all', (type, file) => {
    if (file && !file.endsWith('.css')) {
      Object.keys(require.cache)
        .filter(key => key.startsWith(sourcePath))
        .forEach(key => {
          delete require.cache[key]
        })
      process.exit(0)
    }
  })
})

worker.create(config)
