// @flow

import { graphql } from 'graphql'
import schema from './schema'

import type { GraphQLClient, GraphQLResult } from './types'

function create (data: any): GraphQLClient {
  const rootValue = {
    features: () => data.features,
    posts: () => data.posts
  }

  return {
    query: (q: string): Promise<GraphQLResult> => {
      const p: any = graphql(schema, q, rootValue)

      return p
    }
  }
}

export { create }
export default { create }
