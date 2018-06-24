// @flow

import { removeFile } from './lib/helpers'

import type { Config } from 'types'
import type { Client } from 'redis-client'

async function removePost (config: Config, redis: Client, db: any, task: any) {
  const { logger } = config

  logger.info(`Task: removePost #${task.payload.id}`)

  await removeFile(config, redis, task.payload.id)
}

export default removePost
