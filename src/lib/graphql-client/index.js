// @flow

import { create as createDbClient } from 'db'
import { graphql } from 'graphql'
import schema from './schema'
import rootValue from './rootValue'

import type { Client } from 'redis-client'
import type { GraphQLClient, GraphQLError, GraphQLResult } from './types'

export type { GraphQLClient, GraphQLError, GraphQLResult }

function create (redis: Client): GraphQLClient {
  const db = createDbClient(redis)

  return {
    query: (q: string): Promise<GraphQLResult> => {
      const p: any = graphql(schema, q, rootValue, db)

      return p
    }
  }
}

export { create }
export default { create }
