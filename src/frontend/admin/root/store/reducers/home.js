// @flow

import type { HomeState } from '../types'

const DEFAULT: HomeState = {
  data: {
    clients: null,
    features: null,
    tasks: null
  },
  errors: null,
  isLoading: false,
  isLoaded: false,
  isFailed: false,
  errorMessage: null
}

export default function tasks (state: HomeState = DEFAULT, msg: any) {
  switch (msg.type) {
    case 'features/REGISTER':
      return {
        ...state,
        data: {
          ...state.data,
          features: {
            ...state.data.features,
            [msg.key]: msg.value
          }
        }
      }

    case 'home/LOAD':
      return {
        ...state,
        isLoading: true
      }

    case 'home/LOAD_SUCCESS':
      return {
        ...state,
        data: msg.data || null,
        errors: msg.errors || null,
        isLoading: false,
        isLoaded: true
      }

    case 'home/LOAD_ERROR':
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
