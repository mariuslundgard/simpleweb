import { applyMiddleware, createStore as reduxCreateStore } from 'redux'
import routeMiddleware from './middleware/route'
import graphqlMiddleware from '../middleware/graphql'
import reducers from '../reducers'

function createStore (initialState, opts) {
  const middleware = applyMiddleware(
    routeMiddleware.create(opts.route),
    graphqlMiddleware.create(opts.graphql)
  )

  return reduxCreateStore(reducers, initialState, middleware)
}

export { createStore }
