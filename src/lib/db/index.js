// @flow

import clients from './clients'
import features from './features'
import posts from './posts'
import tasks from './tasks'

import type { Client } from 'redis-client'
import type { DbClient } from './types'

export type { DbClient }

export { create }
export default { create }

function create (redis: Client) {
  const { cache } = redis

  return {
    clients: clients.create(redis),
    features: features.create(redis),
    modifiedTime: {
      async findOne (params: any) {
        const rawModifiedTime = await cache.get('modified_time')

        return rawModifiedTime ? Number(rawModifiedTime) : null
      }
    },
    posts: posts.create(redis),
    tasks: tasks.create(redis)
  }
}
