// @flow

import express from 'express'
import { parseGoogleHeaders } from './helpers'

import type { $Request, $Response } from 'express'
import type { Config } from '../../types'

function create (config: Config) {
  const { logger } = config
  const server = express()

  server.post('/', async (req: $Request, res: $Response) => {
    try {
      logger.info('Received a Google Push Notification', req.headers)

      const payload = parseGoogleHeaders(req.headers)

      await config.queue.producer.rpush(
        'tasks',
        JSON.stringify({ type: 'googleNotification', payload })
      )

      res.json({ message: 'ok' })
    } catch (err) {
      console.error(err.stack)
      res.status(500)
      res.json({
        message: err.message
      })
    }
  })

  return server
}

export default { create }
