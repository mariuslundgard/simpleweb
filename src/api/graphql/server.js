// @flow

import graphqlHTTP from 'express-graphql'
import rootValue from 'graphql-client/rootValue'
import schema from 'graphql-client/schema'

import type { DbClient } from 'db'
import type { Config } from 'types'

function create (config: Config, db: DbClient) {
  const { graphiql } = config

  return graphqlHTTP(() => ({
    context: db,
    graphiql,
    rootValue,
    schema
  }))
}

export default { create }
