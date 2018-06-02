// @flow

import graphqlHTTP from 'express-graphql'
import schema from './schema'
import resolvers from './resolvers'

import type { Config } from '../../types'

const rootValue = {
  channel: (params, context, info) => {
    return context.channels.findOne(params, context, info.fieldNodes[0])
  },
  modifiedTime: (params, context, info) => {
    return context.modifiedTime.findOne(params, context, info.fieldNodes[0])
  },
  post: (params, context, info) => {
    return context.posts.findOne(params, context, info.fieldNodes[0])
  },
  posts: (params, context, info) => {
    return context.posts.findAll(params, context, info.fieldNodes[0])
  }
}

function create (config: Config) {
  const { cache, graphiql } = config

  return graphqlHTTP(() => ({
    context: resolvers.create({ cache }),
    graphiql,
    rootValue,
    schema
  }))
}

export default { create }
