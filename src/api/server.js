// @flow

import { create as createDbClient } from 'db'
import express from 'express'
import { create as createRedisClient } from 'redis-client'

// Import routers
import graphql from './graphql/server'
import notifications from './notifications/server'
import trigger from './trigger/server'

import type { Config } from 'types'

function create (config: Config) {
  const server = express()
  const redis = createRedisClient(config.redis)
  const db = createDbClient(redis)

  server.use('/notifications', notifications.create(config, db))
  server.use('/trigger', trigger.create(config, db))
  server.use('/graphql', graphql.create(config, db))

  return server
}

export default { create }
