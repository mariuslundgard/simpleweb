// @flow

import bodyParser from 'body-parser'
import { create as createDbClient } from 'db'
import express from 'express'
import { create as createRedisClient } from 'redis-client'
import { registerFeature, registerTask } from '../root/store/actions'

import type { $Request, $Response } from 'express'
import type { Config } from 'types'
import type { FrontendMsg, ServerMsg } from '../types'

function create (config: Config) {
  const redis = createRedisClient(config.redis, 'admin/events')
  const db = createDbClient(redis)
  const { publisher, subscriber } = redis.pubsub
  const clients = {
    home: [],
    features: [],
    tasks: []
  }

  // Listen to completed tasks
  subscriber.on('message', (channel, value) => {
    if (channel === 'task:completed' && value === 'flushall') {
      clients.tasks.forEach(res => {
        res.write(`data: ${JSON.stringify({ type: 'tasks/FLUSHALL' })}\n\n`)
      })
    }
  })
  subscriber.subscribe('task:completed')

  // Listen to Redis Keyspace Notifications
  subscriber.on('pmessage', (pattern, channel, ...args) => {
    // console.log(pattern, channel, args)

    switch (true) {
      case channel === '__keyevent@0__:set' && args[0].startsWith('tasks:'):
        db.tasks
          .get(args[0].substr(6))
          .then(task => {
            if (!task) return
            clients.tasks.forEach(res => {
              res.write(`data: ${JSON.stringify(registerTask(task))}\n\n`)
            })
          })
          .catch(err => {
            console.error(err.stack)
          })
        break

      case channel === '__keyevent@0__:set' &&
        args[0].startsWith('features:'): {
        const key = args[0].substr(9)
        db.features
          .get(key)
          .then(value => {
            clients.features.forEach(res => {
              res.write(
                `data: ${JSON.stringify(registerFeature(key, value))}\n\n`
              )
            })
          })
          .catch(err => {
            console.error(err.stack)
          })
        break
      }

      case channel === '__keyevent@0__:set' && args[0].startsWith('client:'): {
        const id = args[0].substr(7)
        db.clients
          .findOne({ id }, db, null)
          .then(client => {
            clients.home.forEach(res => {
              res.write(
                `data: ${JSON.stringify({
                  type: 'home/ADD_CLIENT',
                  client
                })}\n\n`
              )
            })
          })
          .catch(err => {
            console.error(err.stack)
          })
        break
      }

      case channel === '__keyevent@0__:del' && args[0].startsWith('client:'): {
        const id = args[0].substr(7)
        db.clients
          .findOne({ id }, db, null)
          .then(client => {
            clients.home.forEach(res => {
              res.write(
                `data: ${JSON.stringify({
                  type: 'home/REMOVE_CLIENT',
                  id
                })}\n\n`
              )
            })
          })
          .catch(err => {
            console.error(err.stack)
          })
        break
      }
    }
  })
  subscriber.psubscribe('__key*__:*')

  const app = express()

  app.disable('x-powered-by')

  async function handler (req, res, name: string) {
    clients[name].push(res)

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    })

    const msg: ServerMsg = {
      type: 'eventSource/SUBSCRIBE_SUCCESS',
      channel: name
    }

    res.write('data: ' + JSON.stringify(msg) + '\n\n')

    const tickIntervalId = setInterval(() => {
      res.write('data: ' + JSON.stringify({ type: 'TICK' }) + '\n\n')
    }, 5000)

    req.on('close', () => {
      // console.log('disconnected')
      clients[name].splice(clients[name].indexOf(res), 1)
      clearInterval(tickIntervalId)
    })
  }

  app.get('/home', async (req: $Request, res: $Response) => {
    await handler(req, res, 'home')
  })

  app.get('/features', async (req: $Request, res: $Response) => {
    await handler(req, res, 'features')
  })

  app.get('/tasks', async (req: $Request, res: $Response) => {
    await handler(req, res, 'tasks')
  })

  app.post('/', bodyParser.json(), async (req: $Request, res: $Response) => {
    if (typeof req.body === 'object' && req.body !== null) {
      const msg: FrontendMsg = (req.body: any)

      if (msg) {
        switch (msg.type) {
          case 'features/TOGGLE': {
            await db.features.toggle(msg.key)
            break
          }

          case 'clients/SEND': {
            publisher.publish(`client:${msg.id}:channel`, msg.text)
            break
          }

          case 'tasks/TRIGGER': {
            await db.tasks.create(msg.key)
            break
          }
        }
      }
    }

    res.send({ message: 'ok' })
  })

  return app
}

export { create }
export default { create }
