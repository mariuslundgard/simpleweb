// @flow

import express from 'express'

// Import sub-apps
import events from './events/server'
import root from './root/server'

import type { GraphQLClient } from 'graphql-client'
import type { Config } from 'types'

export type AdminConfig = Config & {
  graphQLClient: GraphQLClient
}

function create (config: AdminConfig) {
  const app = express()

  app.use('/events', events.create(config))
  app.use('/', root.create(config))

  return app
}

export { create }
export default { create }
