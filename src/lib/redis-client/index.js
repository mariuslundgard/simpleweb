import redis from 'redis'
import { promisify } from 'util'

import type { Cache, Queue, PubSub } from 'types/redis'

type Client = {
  cache: Cache,
  queue: Queue,
  pubsub: PubSub
}

type Opts = {
  url: string
}

function create (opts: Opts): Client {
  return {
    cache: (client => ({
      get: promisify(client.get).bind(client),
      expire: promisify(client.expire).bind(client),
      keys: promisify(client.keys).bind(client),
      set: promisify(client.set).bind(client),
      del: promisify(client.del).bind(client),
      hset: promisify(client.hset).bind(client),
      sadd: promisify(client.sadd).bind(client),
      srem: promisify(client.srem).bind(client),
      smembers: promisify(client.smembers).bind(client)
    }))(redis.createClient(opts.url)),

    queue: {
      consumer: (client => ({
        blpop: promisify(client.blpop).bind(client)
      }))(redis.createClient(opts.url)),
      producer: (client => ({
        rpush: promisify(client.rpush).bind(client)
      }))(redis.createClient(opts.url))
    },

    pubsub: {
      publisher: redis.createClient(opts.url),
      subscriber: redis.createClient(opts.url)
    }
  }
}

export { create }
export default { create }
