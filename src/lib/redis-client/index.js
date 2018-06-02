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

function createCache (redisUrl, name): Cache {
  console.log(`[${name}]`, 'createCache')
  return (client => ({
    del: promisify(client.del).bind(client),
    get: promisify(client.get).bind(client),
    expire: promisify(client.expire).bind(client),
    flushall: promisify(client.flushall).bind(client),
    hset: promisify(client.hset).bind(client),
    keys: promisify(client.keys).bind(client),
    sadd: promisify(client.sadd).bind(client),
    set: promisify(client.set).bind(client),
    smembers: promisify(client.smembers).bind(client),
    srem: promisify(client.srem).bind(client)
  }))(redis.createClient(redisUrl))
}

function createQueue (redisUrl, name): Queue {
  console.log(`[${name}]`, 'createQueue')
  return {
    consumer: (client => ({
      blpop: promisify(client.blpop).bind(client)
    }))(redis.createClient(redisUrl)),
    producer: (client => ({
      rpush: promisify(client.rpush).bind(client)
    }))(redis.createClient(redisUrl))
  }
}

function createPubSub (redisUrl, name) {
  console.log(`[${name}]`, 'createPubSub')

  const publisher = redis.createClient(redisUrl)
  const subscriber = redis.createClient(redisUrl)

  subscriber.setMaxListeners(1000)

  return {
    publisher,
    subscriber
  }
}

const rootRegistry = {}

function create (opts: Opts, name: ?string): Client {
  if (!rootRegistry[name]) {
    rootRegistry[name] = {
      cache: null,
      queue: null,
      pubsub: null
    }
  }

  return {
    get cache () {
      if (!rootRegistry[name].cache) {
        rootRegistry[name].cache = createCache(opts.url, name)
      }

      return rootRegistry[name].cache
    },

    get queue () {
      if (!rootRegistry[name].queue) {
        rootRegistry[name].queue = createQueue(opts.url, name)
      }

      return rootRegistry[name].queue
    },

    get pubsub () {
      if (!rootRegistry[name].pubsub) {
        rootRegistry[name].pubsub = createPubSub(opts.url, name)
      }

      return rootRegistry[name].pubsub
    }
  }
}

export { create }
export default { create }
