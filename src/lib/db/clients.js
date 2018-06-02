// @flow

// import { getFields } from './lib/helpers'

import type { Client } from 'redis-client'
import type { ClientsResolver, DbClient } from './types'

async function fetchClients (cache) {
  const clientIds = await cache.smembers('client_ids')

  if (!clientIds) {
    return null
  }

  const rawClients = await Promise.all(
    clientIds.map(id => cache.get(`client:${id}`))
  )

  return rawClients.filter(Boolean).map(rawClient => JSON.parse(rawClient))
}

function create (redis: Client): ClientsResolver {
  const { cache } = redis

  return {
    async findOne (params: any, db: DbClient, fieldNode: any) {
      const clients = await fetchClients(cache)

      if (!clients) {
        return null
      }

      const result = clients.find(client => client.id === params.id)

      return result
    },

    async findAll (params: any, db: DbClient, fieldNode: any) {
      const clients = await fetchClients(cache)

      if (!clients) {
        return null
      }

      return clients
    }
  }
}

export default { create }
