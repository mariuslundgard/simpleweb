// @flow

import express from 'express'
import graphql from './graphql/server'
import notifications from './notifications/server'
import trigger from './trigger/server'

import type { Config } from '../types'

function create (config: Config) {
  const server = express()

  server.use('/notifications', notifications.create(config))
  server.use('/trigger', trigger.create(config))
  server.use('/graphql', graphql.create(config))

  return server
}

export default { create }
