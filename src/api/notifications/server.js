// @flow

import express from 'express'
import { parseGoogleHeaders } from './helpers'

import type { $Request, $Response } from 'express'
import type { Config } from '../../types'

function create (config: Config) {
  const server = express()

  server.post('/', async (req: $Request, res: $Response) => {
    try {
      const payload = parseGoogleHeaders(req.headers)

      await config.queue.producer.rpush(
        'tasks',
        JSON.stringify({ type: 'googleNotification', payload })
      )

      res.send('ok')
    } catch (err) {
      res.send(err.stack)
    }
  })

  return server
}

export default { create }
