// @flow

import posts from './posts'

import type { Opts } from './_types'

export default { create }

function create (opts: Opts) {
  return {
    channels: {
      async findOne () {
        const rawChannel = await opts.cache.get('channel')

        if (rawChannel) {
          const channel = JSON.parse(rawChannel)

          return {
            ...channel,
            expirationTime: new Date(Number(channel.expiration))
          }
        }

        return null
      }
    },
    modifiedTime: {
      async findOne (params: any) {
        return opts.cache.get('modifiedTime')
      }
    },
    posts: posts.create(opts)
  }
}
