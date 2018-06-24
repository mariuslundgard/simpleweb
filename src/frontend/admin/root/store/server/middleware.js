// @flow

import { applyMiddleware } from 'redux'
import apiMiddleware from '../middleware/api'

function create (opts: any) {
  const { graphQLClient } = opts
  return applyMiddleware(apiMiddleware.create({ client: graphQLClient }))
}

export { create }
export default { create }
