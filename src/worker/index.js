// @flow

import { create as createDbClient } from 'db'
import { create as createRedisClient } from 'redis-client'
import taskHandlers from './taskHandlers'

import type { Config } from 'types'

export default { create }

const TASK_DELAY = 250

function create (config: Config) {
  const { logger } = config
  const redis = createRedisClient(config.redis)
  const { consumer } = redis.queue
  const { subscriber } = redis.pubsub
  const db = createDbClient(redis)

  // Start task handling cycle
  getNextTask()

  // Trigger initial sync
  // Promise.all([db.tasks.create('sync'), db.tasks.create('subscribe')]).catch(
  //   err => logger.error(err.stack)
  // )

  // Listen to Redis Keyspace Notifications
  subscriber.psubscribe('__key*__:*')
  subscriber.on('pmessage', (pattern, channel, ...args) => {
    switch (channel) {
      case '__keyevent@0__:expired':
        if (args[0] === 'channel') {
          db.tasks.create('subscribe').catch(err => {
            console.error(err.stack)
          })
        }
        break
    }
  })

  /*
   * Private functions
   */

  async function handleTask (id) {
    const queuedTask = await db.tasks.get(id)

    if (!queuedTask) return

    let startedTask

    if (taskHandlers[queuedTask.type]) {
      try {
        startedTask = {
          status: 'started',
          type: queuedTask.type,
          id: queuedTask.id,
          payload: queuedTask.payload,
          created: queuedTask.created,
          started: Date.now()
        }
        await db.tasks.save(startedTask)
        await taskHandlers[startedTask.type](config, redis, db, startedTask)
      } catch (err) {
        if (startedTask) {
          const failedTask = {
            status: 'failed',
            type: startedTask.type,
            id: startedTask.id,
            payload: startedTask.payload,
            created: startedTask.created,
            started: startedTask.started,
            failed: Date.now(),
            error: {
              errors: err.errors,
              code: err.code,
              message: err.message
            }
          }
          await db.tasks.save(failedTask)
        }
        return
      }

      const completedTask = {
        status: 'completed',
        type: startedTask.type,
        id: startedTask.id,
        payload: startedTask.payload,
        created: startedTask.created,
        started: startedTask.started,
        completed: Date.now()
      }

      await db.tasks.save(completedTask)
      return
    }

    throw new Error(`Unknown task: ${queuedTask.type}`)
  }

  function getNextTask () {
    consumer
      .blpop('tasks', 0)
      .then(result => {
        if (result && result[1]) {
          return handleTask(result[1])
            .then(() => {
              setTimeout(() => getNextTask(), TASK_DELAY)
            })
            .catch(err => {
              if (err.errors) {
                logger.error(err.errors)
              }
              logger.error(err.stack)
              setTimeout(() => getNextTask(), TASK_DELAY)
            })
        } else {
          setTimeout(() => getNextTask(), TASK_DELAY)
        }
      })
      .catch(err => {
        if (err.errors) {
          console.log(err.errors)
        }
        logger.error(err.stack)
      })
  }
}
