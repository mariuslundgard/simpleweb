// @flow

import { applyMiddleware } from 'redux'
import graphqlMiddleware from '../middleware/graphql'
import eventSourceMiddleware from './middleware/eventSource'
import routeMiddleware from './middleware/route'

import type { Opts as GraphQLMiddlewareOpts } from '../middleware/graphql'

type Opts = {
  graphql: GraphQLMiddlewareOpts
}

function create (opts: Opts) {
  return applyMiddleware(
    eventSourceMiddleware.create(),
    graphqlMiddleware.create(opts.graphql),
    routeMiddleware.create()
  )
}

export { create }
export default { create }
