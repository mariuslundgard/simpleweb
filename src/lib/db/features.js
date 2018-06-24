// @flow

import { getFields } from './lib/helpers'

import type { Client } from 'redis-client'
import type { FeaturesResolver } from './types'

export default { create }

function create (redis: Client): FeaturesResolver {
  const { cache } = redis

  async function get (key: string) {
    const flag = await cache.get(`features:${key}`)
    return flag === 'on'
  }

  async function set (key: string, value: boolean) {
    return cache
      .set(`features:${key}`, value ? 'on' : 'off')
      .then(() => undefined)
  }

  return {
    get,

    set,

    async toggle (key: string) {
      const value = await get(key)
      await set(key, !value)
    },

    async find (params: any, db: any, fieldNode: any) {
      const fields = getFields(fieldNode)
      const features = {}

      if (fields.maintenance) {
        features.maintenance = await get('maintenance')
      }

      if (fields.projects) {
        features.projects = await get('projects')
      }

      return features
    }
  }
}
