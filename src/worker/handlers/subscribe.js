// @flow

import uuid from 'uuid/v4'
import gapi from '../lib/gapi'

import type { Config } from '../../types'

const EXPIRATION = 60

async function subscribe (config: Config) {
  const { cache } = config

  const rawChannel = await cache.get('channel')

  if (rawChannel) {
    console.log(
      '[worker] already subscribed to channel',
      JSON.parse(rawChannel)
    )
    return
  }

  const token = await gapi.oauth2.token({
    credentials: config.google.credentials,
    scopes: ['https://www.googleapis.com/auth/drive']
  })

  const startPageToken = await gapi.drive.changes.getStartPageToken({
    token
  })

  const channel = await gapi.drive.changes.watch({
    address: 'https://mariuslundgard.com/notifications',
    token,
    id: uuid(),
    pageToken: startPageToken,
    resourceId: config.google.rootFolderId,
    expiration: new Date().getTime() + 1000 * EXPIRATION
  })

  // const ttl = Number(channel.expiration) - new Date().getTime()

  // channelTimeoutId = setTimeout(() => {
  //   channelTimeoutId = null
  //
  //   console.log('expired!')
  //
  //   cache
  //     .del('channel')
  //     .then(() => subscribe())
  //     .then(c => {
  //       console.log('updated subscription')
  //     })
  //     .catch(err => console.error(err.stack))
  // }, ttl - 1000)

  await cache.set('channel', JSON.stringify(channel))
  await cache.expire('channel', EXPIRATION)

  console.log('[worker] subscribed to channel', channel)
}

export default subscribe
