// @flow

import gapi from './lib/gapi'
import { fetchToken } from './lib/helpers'

import type { Config } from '../../types'

async function sync (config: Config) {
  const { logger } = config

  logger.info('Task: sync')

  const { rootFolderId } = config.google

  if (!rootFolderId) {
    throw new Error('Missing root folder ID')
  }

  const token = await fetchToken(config)

  const childrenResource = await gapi.drive.files.list({
    parentId: rootFolderId,
    token,
    fields: ['id']
  })

  if (!childrenResource.files) {
    logger.info('No files found in Google Drive')
    return
  }

  const addedIds = childrenResource.files.map(file => file.id)

  const postIds = await config.cache.smembers('post_ids')

  await Promise.all(
    addedIds.map(id => {
      return config.queue.producer.rpush(
        'tasks',
        JSON.stringify({ type: 'fetchPost', id })
      )
    })
  )

  const removedIds = (postIds || []).filter(id => {
    return addedIds.indexOf(id) === -1
  })

  await Promise.all(
    removedIds.map(id => {
      return config.queue.producer.rpush(
        'tasks',
        JSON.stringify({ type: 'removePost', id })
      )
    })
  )
}

export default sync
