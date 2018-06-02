'use strict'

const config = require('../config')
const worker = require('../../dist/worker')

worker.create(config)
