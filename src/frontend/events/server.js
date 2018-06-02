// @flow

import express from 'express'
import { create as createRedisClient } from 'redis-client'
import uuid from 'uuid/v4'

import type { $Request, $Response } from 'express'
import type { Config } from 'types'

const sse = {
  sendHeader: res =>
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    }),

  postMessage: (res, msg) => res.write('data: ' + JSON.stringify(msg) + '\n\n')
}

function getRemoteIp (req) {
  return (
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null)
  )
}

function create (config: Config) {
  const redis = createRedisClient(config.redis, 'frontend/events')
  const { cache } = redis
  const { subscriber } = redis.pubsub
  const clients = {
    home: {}
  }

  const app = express()

  app.disable('x-powered-by')

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

  async function sseHandler (req, res, channel) {
    const ip = getRemoteIp(req)

    sse.sendHeader(res)

    const clientId = uuid()

    clients.home[clientId] = res

    await cache.sadd('client_ids', clientId)
    await cache.set(
      `client:${clientId}`,
      JSON.stringify({ id: clientId, ip, channel })
    )

    sse.postMessage(res, {
      type: 'eventSource/SUBSCRIBE_SUCCESS',
      channel,
      clientId
    })

    const tickIntervalId = setInterval(
      () => sse.postMessage(res, { type: 'TICK' }),
      5000
    )

    const removeClient = () => {
      // console.log('remove client')

      clearInterval(tickIntervalId)

      delete clients.home[clientId]

      cache
        .srem('client_ids', clientId)
        .then(() =>
          cache.del(`client:${clientId}`).then(() => {
            console.log('removed client')
          })
        )
        .catch(err => {
          console.error(err)
          console.error('Could not delete client entry')
        })
    }

    req.on('end', removeClient)
    req.on('close', removeClient)
  }

  app.get('/home', async (req: $Request, res: $Response) => {
    await sseHandler(req, res, 'home')
  })

  app.get('/post/:id', async (req: $Request, res: $Response) => {
    await sseHandler(req, res, `post/${req.params.id}`)
  })

  return app
}

export { create }
export default { create }
