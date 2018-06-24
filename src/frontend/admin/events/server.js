// @flow

import bodyParser from 'body-parser'
import { create as createDbbClient } from 'db'
import express from 'express'
import { create as createRedisClient } from 'redis-client'
import { registerFeature, registerTask } from '../root/store/actions'

import type { $Request, $Response } from 'express'
import type { Config } from 'types'

function create (config: Config) {
  const redis = createRedisClient(config.redis)

  const { publisher, subscriber } = redis.pubsub
  const db = createDbbClient(config)
  const clients = {
    home: []
  }

  // Listen to Redis Keyspace Notifications
  subscriber.psubscribe('__key*__:*')
  subscriber.on('pmessage', (pattern, channel, ...args) => {
    // console.log(pattern, channel, args)
    switch (true) {
      case channel === '__keyevent@0__:set' && args[0].startsWith('tasks:'):
        db.tasks
          .get(args[0].substr(6))
          .then(task => {
            if (!task) return
            clients.home.forEach(res => {
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
            clients.home.forEach(res => {
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
    }
  })

  const app = express()

  app.get('/home', (req: $Request, res: $Response) => {
    clients.home.push(res)

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    })

    const data = { type: 'eventSource/SUBSCRIBE_SUCCESS', channel: 'home' }

    res.write('data: ' + JSON.stringify(data) + '\n\n')

    req.on('close', () => {
      console.log('disconnected')
      clients.home.splice(clients.home.indexOf(res), 1)
    })
  })

  app.post('/', bodyParser.json(), async (req: $Request, res: $Response) => {
    const msg: any = req.body

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

    res.send({ message: 'ok' })
  })

  return app
}

export { create }
export default { create }
