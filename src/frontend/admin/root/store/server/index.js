import { createStore as reduxCreateStore } from 'redux'
import middleware from './middleware'
import reducers from '../reducers'

function createStore (initialState, opts) {
  return reduxCreateStore(reducers, initialState, middleware.create(opts))
}

export { createStore }
