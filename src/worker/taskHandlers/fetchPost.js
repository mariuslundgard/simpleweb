// @flow

import { updateFile, addFile } from './lib/helpers'

import type { Config } from '../../types'

async function fetchPost (config: Config, task: any) {
  const { cache, logger } = config

  logger.info(`Task: fetchPost #${task.id}`)

  const postIds = await cache.smembers('post_ids')

  if (postIds && postIds.indexOf(task.id) > -1) {
    updateFile(config, task.id)
  } else {
    addFile(config, task.id)
  }
}

export default fetchPost
