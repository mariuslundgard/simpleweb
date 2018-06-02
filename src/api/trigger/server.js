// @flow

import express from 'express'

import type { $Request, $Response } from 'express'
import type { Config } from '../../types'

function create (config: Config) {
  const server = express()

  server.get('/fetch-posts', async (req: $Request, res: $Response) => {
    await config.queue.producer.rpush(
      'tasks',
      JSON.stringify({ type: 'fetchPosts' })
    )

    res.send('ok')
  })

  server.get('/subscribe', async (req: $Request, res: $Response) => {
    await config.queue.producer.rpush(
      'tasks',
      JSON.stringify({ type: 'subscribe' })
    )

    res.send('ok')
  })

  server.get('/unsubscribe', async (req: $Request, res: $Response) => {
    await config.queue.producer.rpush(
      'tasks',
      JSON.stringify({ type: 'unsubscribe' })
    )

    res.send('ok')
  })

  return server
}

export default { create }
