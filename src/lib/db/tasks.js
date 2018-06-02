// @flow

import uuid from 'uuid/v4'
// import { getFields } from './lib/helpers'

import type { QueuedTask, Task } from 'types'
import type { Client } from 'redis-client'
import type { TasksResolver } from './types'

export default { create }

function create (redis: Client): TasksResolver {
  const { cache, queue } = redis

  return {
    async create (type: string, payload: any) {
      const id = uuid()
      const task: QueuedTask = {
        id,
        type,
        created: Date.now(),
        status: 'queued',
        payload
      }

      await cache.set(`tasks:${id}`, JSON.stringify(task))
      await queue.producer.rpush('tasks', id)

      return task
    },

    async get (id: string) {
      const rawTask = await cache.get(`tasks:${id}`)

      if (!rawTask) {
        return null
        // throw new Error('Missing task')
      }

      return JSON.parse(rawTask)
    },

    save (task: Task) {
      return cache
        .set(`tasks:${task.id}`, JSON.stringify(task))
        .then(() => undefined)
    },

    async findAll (params: any, db: any, fieldNode: any) {
      const keys = await cache.keys('tasks:*')
      const rawTasks = await Promise.all(keys.map(key => cache.get(key)))
      const tasks = rawTasks.filter(Boolean).map(rawTask => JSON.parse(rawTask))

      tasks.sort((a, b) => b.created - a.created)

      return tasks
    }
  }
}
