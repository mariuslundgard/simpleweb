// @flow

import express from 'express'
import api from './api/server'
import frontend from './frontend/server'

import type { Config } from 'types'

export function create (config: Config) {
  const app = express()

  app.disable('x-powered-by')

  app.use('/api', api.create(config))
  app.use('/', frontend.create(config))

  return app
}
