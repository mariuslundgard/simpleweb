// @flow

import { applyMiddleware } from 'redux'
import graphqlMiddleware from '../middleware/graphql'

function create (opts: any) {
  const { graphQLClient } = opts
  return applyMiddleware(graphqlMiddleware.create({ client: graphQLClient }))
}

export { create }
export default { create }
