// @flow

import type { Route } from '../types'

function matchRoute (path: string, basePath: string = ''): Route {
  path = path.substr(basePath.length)

  const parts = path.split('/')

  switch (true) {
    case path === '/':
      return { name: 'home', params: {} }
    case path.startsWith('/article/') && parts.length === 3:
      return { name: 'article', params: { id: parts[2] } }
    case path.startsWith('/project/') && parts.length === 3:
      return { name: 'project', params: { id: parts[2] } }
    default:
      return { name: null, params: {} }
  }
}

export default matchRoute
