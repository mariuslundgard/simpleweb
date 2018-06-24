// @flow

import express from 'express'
import { create as createGraphQLClient } from 'graphql-client'
import { create as createRedisClient } from 'redis-client'

// Import sub-apps
import admin from './admin/server'
import events from './events/server'
import maintenance from './maintenance/server'
import root from './root/server'

import type { $Request, $Response } from 'express'
import type { Config } from 'types'

function create (config: Config) {
  const redis = createRedisClient(config.redis)
  const graphQLClient = createGraphQLClient(redis)
  const app = express()

  app.use('/admin', admin.create({ ...config, graphQLClient }))
  app.use('/events', events.create(config))

  app.use(async (req: $Request, res: $Response, next) => {
    try {
      const featuresResult = await graphQLClient.query(`{
        features {
          maintenance
          projects
        }
      }`)

      if (featuresResult.data) {
        const { features } = featuresResult.data

        if (features.maintenance) {
          if (req.path.startsWith('/preview/')) {
            const handler: any = root.create({
              ...config,
              features,
              graphQLClient,
              basePath: '/preview'
            })

            handler(req, res, next)
            return
          }

          const handler: any = maintenance.create(config)

          handler(req, res, next)
        } else {
          const handler: any = root.create({
            ...config,
            features,
            graphQLClient,
            basePath: ''
          })

          handler(req, res, next)
        }
      } else {
        res.send('Could not load features')
      }
    } catch (err) {
      next(err)
    }
  })

  return app
}

export { create }
export default { create }
