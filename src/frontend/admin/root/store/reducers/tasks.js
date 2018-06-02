// @flow

import type { TasksState } from '../types'

const DEFAULT: TasksState = {
  data: {
    tasks: null
  },
  errors: null,
  isLoading: false,
  isLoaded: false,
  isFailed: false,
  errorMessage: null
}

export default function tasks (state: TasksState = DEFAULT, msg: any) {
  switch (msg.type) {
    case 'tasks/FLUSHALL':
      return {
        ...state,
        data: {
          tasks: []
        }
      }

    case 'tasks/LOAD':
      return {
        ...state,
        isLoading: true
      }

    case 'tasks/LOAD_SUCCESS':
      return {
        ...state,
        data: msg.data || null,
        errors: msg.errors || null,
        isLoading: false,
        isLoaded: true
      }

    case 'tasks/LOAD_ERROR':
      return {
        ...state,
        isLoading: false,
        isFailed: true,
        errorMessage: msg.message
      }

    case 'tasks/REGISTER':
      switch (msg.task.status) {
        case 'queued':
          return {
            ...state,
            data: {
              ...state.data,
              tasks: [msg.task].concat(state.data.tasks)
            }
          }

        case 'started':
        case 'completed':
        case 'failed': {
          const tasks = state.data.tasks || []
          return {
            ...state,
            data: {
              ...state.data,
              tasks: tasks.map(t => {
                if (t.id === msg.task.id) {
                  return msg.task
                }
                return t
              })
            }
          }
        }

        default:
          return state
      }

    default:
      return state
  }
}
