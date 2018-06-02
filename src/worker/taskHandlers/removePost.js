// @flow

import { removeFile } from './lib/helpers'

import type { Config } from '../../types'

async function removePost (config: Config, task: any) {
  const { logger } = config

  logger.info(`Task: removePost #${task.id}`)

  await removeFile(config, task.id)
}

export default removePost
