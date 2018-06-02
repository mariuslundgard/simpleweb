// @flow

import { updateFile, addFile } from './lib/helpers'

import type { Config } from 'types'
import type { Client } from 'redis-client'

async function fetchPost (config: Config, redis: Client, db: any, task: any) {
  const { logger } = config
  const { cache } = redis

  logger.info(`Task: fetchPost #${task.payload.id}`)

  const postIds = await cache.smembers('post_ids')

  if (postIds && postIds.indexOf(task.payload.id) > -1) {
    await updateFile(config, redis, task.payload.id)
  } else {
    await addFile(config, redis, task.payload.id)
  }
}

export default fetchPost
