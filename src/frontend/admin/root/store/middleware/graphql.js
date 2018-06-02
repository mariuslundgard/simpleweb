// @flow

import type { GraphQLClient } from 'graphql-client'
import type { Middleware } from 'redux'

export type Opts = {
  client: GraphQLClient
}

type QueryGraphQL = {
  type: 'graphql/QUERY',
  types: [string, string, string],
  query: string
}

type Action = QueryGraphQL

function create ({ client }: Opts): Middleware {
  return store => next => (action: Action) => {
    if (action.type === 'graphql/QUERY') {
      store.dispatch({ type: action.types[0] })
      client
        .query(action.query)
        .then(result => {
          store.dispatch({
            type: action.types[1],
            ...result
          })
        })
        .catch(err => {
          store.dispatch({
            type: action.types[2],
            error: {
              message: err.message,
              stack: err.stack
            }
          })
        })
    }

    return next(action)
  }
}

export default { create }
