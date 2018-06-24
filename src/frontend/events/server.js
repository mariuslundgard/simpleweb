// @flow

import express from 'express'
import { create as createRedisClient } from 'redis-client'
import uuid from 'uuid/v4'

import type { $Request, $Response } from 'express'
import type { Config } from 'types'

function create (config: Config) {
  const redis = createRedisClient(config.redis)
  const { cache } = redis
  const { subscriber } = redis.pubsub
  const app = express()
  const clients = {
    home: {}
  }

  // subscriber.on('subscribe', (...args) => {
  //   console.log('did subscribe', args)
  // })

  const handleMsg = (pattern, channel, ...args) => {
    const id = channel.split(':')[1]

    if (clients.home[id]) {
      const res = clients.home[id]

      res.write(
        `data: ${JSON.stringify({
          type: 'home/MESSAGE',
          id,
          text: args[0]
        })}\n\n`
      )
    }
  }

  subscriber.on('pmessage', handleMsg)

  subscriber.psubscribe(`client:*:channel`)

  app.get('/home', async (req: $Request, res: $Response) => {
    const ip =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null)

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    })

    const clientId = uuid()

    clients.home[clientId] = res

    await cache.sadd('client_ids', clientId)
    await cache.set(`client:${clientId}`, JSON.stringify({ id: clientId, ip }))

    const data = {
      type: 'eventSource/SUBSCRIBE_SUCCESS',
      channel: 'home',
      clientId
    }

    res.write('data: ' + JSON.stringify(data) + '\n\n')

    req.on('close', () => {
      delete clients.home[clientId]

      cache
        .srem('client_ids', clientId)
        .then(() => {
          return cache.del(`client:${clientId}`).then(() => {
            console.log('removed client')
          })
        })
        .catch(err => {
          console.error(err)
          console.error('Could not delete client entry')
        })
    })
  })

  return app
}

export { create }
export default { create }
