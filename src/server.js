// @flow

import express from 'express'
import api from './api/server'
import frontend from './frontend/server'

import type { Config } from './types'

export function create (config: Config) {
  const server = express()

  server.use('/api', api.create(config))
  server.use('/', frontend.create(config))

  return server
}
