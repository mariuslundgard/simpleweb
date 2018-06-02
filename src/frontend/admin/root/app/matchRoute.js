// @flow

import type { Route } from '../types'

function matchRoute (path: string, basePath: string = ''): Route {
  switch (true) {
    case path === `${basePath}/`:
      return { name: 'home', params: {} }

    case path === `${basePath}/tasks`:
      return { name: 'tasks', params: {} }

    case path === `${basePath}/features`:
      return { name: 'features', params: {} }

    default:
      return { name: null, params: {} }
  }
}

export default matchRoute
