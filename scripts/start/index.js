'use strict'

const cluster = require('cluster')

if (cluster.isMaster) {
  require('./main')
  startWorker()
}

if (cluster.isWorker) {
  require('./worker')
}

function startWorker () {
  cluster.fork().on('exit', () => {
    console.log('[main] the worker stopped')
    startWorker()
  })
}
