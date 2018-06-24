// @flow

import gapi from 'gapi'
import { fetchToken } from './lib/helpers'

import type { Config } from 'types'
import type { Client } from 'redis-client'

async function unsubscribe (config: Config, redis: Client, db: any) {
  const { logger } = config
  const { cache } = redis

  logger.info('Task: unsubscribe')

  const rawChannel = await cache.get('channel')

  if (!rawChannel) {
    throw new Error('Not subsbcribed')
  }

  const channel = JSON.parse(rawChannel)
  const token = await fetchToken(config)

  await gapi.drive.channels.stop({ channel, token })
  await cache.del('channel')

  logger.info('Unsubscribed')
}

export default unsubscribe
