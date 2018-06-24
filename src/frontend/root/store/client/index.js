import { applyMiddleware, createStore as reduxCreateStore } from 'redux'
import graphqlMiddleware from '../middleware/graphql'
import reducers from '../reducers'
import eventSourceMiddleware from './middleware/eventSource'
import routeMiddleware from './middleware/route'

function createStore (initialState, opts) {
  const middleware = applyMiddleware(
    eventSourceMiddleware.create(),
    routeMiddleware.create(opts.route),
    graphqlMiddleware.create(opts.graphql)
  )

  return reduxCreateStore(reducers, initialState, middleware)
}

export { createStore }
