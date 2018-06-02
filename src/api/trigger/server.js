// @flow

import express from 'express'

import type { $Request, $Response } from 'express'
import type { Config } from '../../types'

function create (config: Config) {
  const { queue } = config
  const server = express()

  async function queueTask (task: any) {
    const result = await queue.producer.rpush('tasks', JSON.stringify(task))
    return result
  }

  server.get('/sync', async (req: $Request, res: $Response) => {
    await queueTask({ type: 'sync' })
    res.json({ message: 'ok' })
  })

  server.get('/subscribe', async (req: $Request, res: $Response) => {
    await queueTask({ type: 'subscribe' })
    res.json({ message: 'ok' })
  })

  server.get('/unsubscribe', async (req: $Request, res: $Response) => {
    await queueTask({ type: 'unsubscribe' })
    res.json({ message: 'ok' })
  })

  return server
}

export default { create }
