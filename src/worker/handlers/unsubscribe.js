// @flow

import gapi from '../lib/gapi'

import type { Config } from '../../types'

async function unsubscribe (config: Config) {
  const { cache } = config
  const { credentials } = config.google

  // if (channelTimeoutId) {
  //   console.log('clear timeout')
  //   clearTimeout(channelTimeoutId)
  //   channelTimeoutId = null
  // }

  const rawChannel = await cache.get('channel')

  if (!rawChannel) {
    console.log('[worker] not subscribed')
    return
  }

  const channel = JSON.parse(rawChannel)

  const token = await gapi.oauth2.token({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive']
  })

  await gapi.drive.channels.stop({ channel, token })
  await cache.del('channel')

  console.log('[worker] unsubscribed')
}

export default unsubscribe
