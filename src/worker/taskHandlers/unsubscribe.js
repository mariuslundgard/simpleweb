// @flow

import gapi from './lib/gapi'
import { fetchToken } from './lib/helpers'

import type { Config } from '../../types'

async function unsubscribe (config: Config) {
  const { cache, logger } = config

  logger.info('Task: unsubscribe')

  const rawChannel = await cache.get('channel')

  if (!rawChannel) {
    logger.info('Not subscribed')
    return
  }

  const channel = JSON.parse(rawChannel)
  const token = await fetchToken(config)

  await gapi.drive.channels.stop({ channel, token })
  await cache.del('channel')

  logger.info('Unsubscribed')
}

export default unsubscribe
