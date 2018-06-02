// @flow

import express from 'express'

import type { DbClient } from 'db'
import type { $Request, $Response } from 'express'
import type { Config } from 'types'

function create (config: Config, db: DbClient) {
  const server = express()

  server.get('/sync', async (req: $Request, res: $Response) => {
    try {
      const task = await db.tasks.create('sync')
      res.json(task)
    } catch (err) {
      res.send(err.stack)
    }
  })

  server.get('/subscribe', async (req: $Request, res: $Response) => {
    try {
      const task = await db.tasks.create('subscribe')
      res.json(task)
    } catch (err) {
      res.send(err.stack)
    }
  })

  server.get('/unsubscribe', async (req: $Request, res: $Response) => {
    try {
      const task = await db.tasks.create('unsubscribe')
      res.json(task)
    } catch (err) {
      res.send(err.stack)
    }
  })

  return server
}

export default { create }
