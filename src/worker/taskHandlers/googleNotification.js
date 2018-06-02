// @flow

import qs from 'qs'
import gapi from './lib/gapi'
import { fetchToken } from './lib/helpers'

import type { Config } from '../../types'

async function handleChangedTask (config: Config, payload) {
  const { logger } = config

  logger.info('Task: googleNotification.change')

  const query = qs.parse(payload.resourceUri.split('?')[1])
  const token = await fetchToken(config)
  const changes = await gapi.drive.changes.list({ ...query, token })

  await Promise.all(
    changes.changes.map(change => {
      if (change.removed) {
        return config.queue.producer.rpush(
          'tasks',
          JSON.stringify({ type: 'removePost', id: change.fileId })
        )
      } else {
        return config.queue.producer.rpush(
          'tasks',
          JSON.stringify({ type: 'fetchPost', id: change.fileId })
        )
      }
    })
  )
}

async function handleSyncTask (config, payload) {
  const { logger } = config

  logger.info('Task: googleNotification.sync')
}

async function googleNotification (config: Config, task: any) {
  const { payload } = task

  switch (payload.resourceState) {
    case 'change':
      await handleChangedTask(config, payload)
      break
    case 'sync':
      await handleSyncTask(config, payload)
      break
    default:
      throw new Error(`Unknown resource state: ${payload.resourceState}`)
  }
}

export default googleNotification
