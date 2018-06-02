// @flow

import type { Config } from 'types'
import type { Client } from 'redis-client'

async function flushall (config: Config, redis: Client, db: any, task: any) {
  const { logger } = config
  const { cache } = redis

  logger.info(`Task: flushall`)

  return cache.flushall()
}

export default flushall
