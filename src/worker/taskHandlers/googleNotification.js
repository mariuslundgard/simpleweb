// @flow

import qs from 'qs'
import gapi from 'gapi'
import { fetchToken } from './lib/helpers'

import type { DbClient } from 'db'
import type { Config } from 'types'
import type { Client } from 'redis-client'

async function handleChangedTask (
  config: Config,
  redis: Client,
  db: DbClient,
  task: any
) {
  const { logger } = config

  logger.info('Task: googleNotification.change')

  const query = qs.parse(task.resourceUri.split('?')[1])
  const token = await fetchToken(config, redis)
  const changes = await gapi.drive.changes.list({ ...query, token })

  await Promise.all(
    changes.changes.map(change => {
      if (change.removed) {
        return db.tasks.create('removePost', { id: change.fileId })
      } else {
        return db.tasks.create('fetchPost', { id: change.fileId })
      }
    })
  )
}

async function handleSyncTask (
  config: Config,
  redis: Client,
  db: any,
  task: any
) {
  const { logger } = config

  logger.info('Task: googleNotification.sync')
}

async function googleNotification (
  config: Config,
  redis: Client,
  db: any,
  task: any
) {
  const { payload } = task

  switch (payload.resourceState) {
    case 'change':
      await handleChangedTask(config, redis, db, payload)
      break
    case 'sync':
      await handleSyncTask(config, redis, db, payload)
      break
    default:
      throw new Error(`Unknown resource state: ${payload.resourceState}`)
  }
}

export default googleNotification
