// @flow

import gapi from 'gapi'
import uuid from 'uuid/v4'
import { fetchToken } from './lib/helpers'

import type { Config } from 'types'
import type { Client } from 'redis-client'

async function subscribe (config: Config, redis: Client, db: any) {
  const { logger } = config
  const { cache } = redis

  logger.info('Task: subscribe')

  const rawChannel = await cache.get('channel')

  if (rawChannel) {
    throw new Error('Already subscribed')
  }

  const { rootFolderId } = config.google

  const { channelExpiration } = config.google

  const token = await fetchToken(config, redis)
  const startPageToken = await gapi.drive.changes.getStartPageToken({
    token
  })

  const channel = await gapi.drive.changes.watch({
    address: 'https://mariuslundgard.com/api/notifications',
    token,
    id: uuid(),
    pageToken: startPageToken,
    resourceId: rootFolderId,
    expiration: new Date().getTime() + 1000 * channelExpiration
  })

  await cache.set('channel', JSON.stringify(channel))
  await cache.expire('channel', channelExpiration)

  logger.info('Subscribed to channel', channel)
}

export default subscribe
