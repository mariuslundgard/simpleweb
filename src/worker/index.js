// @flow

import taskHandlers from './taskHandlers'

import type { Config } from '../types'

export default { create }

const TASK_DELAY = 250

function create (config: Config) {
  const { logger } = config
  const { consumer } = config.queue

  function handleTask (task) {
    if (taskHandlers[task.type]) {
      return taskHandlers[task.type](config, task)
    }

    throw new Error(`Unknown task: ${task.type}`)
  }

  function getNextTask () {
    consumer
      .blpop('tasks', 0)
      .then(result => {
        if (result) {
          handleTask(JSON.parse(result[1]))
            .then(() => {
              setTimeout(() => getNextTask(), TASK_DELAY)
            })
            .catch(err => {
              logger.error(err.stack)
              setTimeout(() => getNextTask(), TASK_DELAY)
            })
        } else {
          setTimeout(() => getNextTask(), TASK_DELAY)
        }
      })
      .catch(err => {
        logger.error(err.stack)
      })
  }

  taskHandlers
    .sync(config)
    .then(() => getNextTask())
    .catch(err => logger.error(err.stack))

  logger.info('Ready')
}
