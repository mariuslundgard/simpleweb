// @flow

import { matchRoute } from '../../app'

import type { RouteState } from '../types'

const DEFAULT: RouteState = {
  basePath: '',
  name: null,
  params: {},
  query: {},
  isLoadingScreen: false
}

function route (state: RouteState = DEFAULT, msg: any) {
  switch (msg.type) {
    case 'route/ERROR':
      return { ...state, name: 'error', error: msg.error }
    case 'route/LOAD_SCREEN':
      return { ...state, isLoadingScreen: true }
    case 'route/LOAD_SCREEN_SUCCESS':
      return { ...state, isLoadingScreen: false }
    case 'route/NAVIGATE':
      return {
        ...state,
        ...matchRoute(msg.path, state.basePath),
        query: msg.query
      }
    default:
      return state
  }
}

export default route
