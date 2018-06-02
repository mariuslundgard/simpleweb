// @flow

import uuid from 'uuid/v4'
import gapi from './lib/gapi'
import { fetchToken } from './lib/helpers'

import type { Config } from '../../types'

async function subscribe (config: Config) {
  const { cache, logger } = config

  logger.info('Task: subscribe')

  const { channelExpiration } = config.google

  const rawChannel = await cache.get('channel')

  if (rawChannel) {
    logger.info('already subscribed to channel', JSON.parse(rawChannel))
    return
  }

  const token = await fetchToken(config)
  const startPageToken = await gapi.drive.changes.getStartPageToken({
    token
  })

  const channel = await gapi.drive.changes.watch({
    address: 'https://mariuslundgard.com/api/notifications',
    token,
    id: uuid(),
    pageToken: startPageToken,
    resourceId: config.google.rootFolderId,
    expiration: new Date().getTime() + 1000 * channelExpiration
  })

  await cache.set('channel', JSON.stringify(channel))
  await cache.expire('channel', channelExpiration)

  logger.info('subscribed to channel', channel)
}

export default subscribe
