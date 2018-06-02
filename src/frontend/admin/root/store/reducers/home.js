// @flow

import type { HomeState } from '../types'

const DEFAULT: HomeState = {
  data: {
    clients: null
  },
  errors: null,
  isLoading: false,
  isLoaded: false,
  isFailed: false,
  errorMessage: null
}

export default function home (state: HomeState = DEFAULT, msg: any) {
  switch (msg.type) {
    case 'home/ADD_CLIENT': {
      const clients = state.data.clients || []

      if (clients.find(c => msg.client.id)) {
        return state
      }

      return {
        ...state,
        data: {
          ...state.data,
          clients: clients.concat([msg.client])
        }
      }
    }

    case 'home/REMOVE_CLIENT': {
      const clients = state.data.clients || []

      return {
        ...state,
        data: {
          ...state.data,
          clients: clients.filter(c => c.id !== msg.id)
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

    default:
      return state
  }
}
