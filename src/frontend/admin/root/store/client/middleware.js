// @flow

import { applyMiddleware } from 'redux'
import apiMiddleware from '../middleware/api'
import eventSourceMiddleware from './middleware/eventSource'

function create (opts: any) {
  const { apiClient, eventSource } = opts

  return applyMiddleware(
    apiMiddleware.create(apiClient),
    eventSourceMiddleware.create(eventSource)
  )
}

export { create }
export default { create }
