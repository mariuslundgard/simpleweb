// @flow

import { buildSchema } from 'graphql'

export default buildSchema(`
  scalar Date
  scalar PostContent

  type Post {
    id: String
    type: String
    name: String
    title: String
    publishedTime: Date
    modifiedTime: Date
    content: PostContent
    keywords: [String]
  }

  type Channel {
    id: String
    expirationTime: Date
  }

  type Query {
    channel: Channel
    modifiedTime: Date
    post(id: String!): Post
    posts(type: String, sort: String, order: String, keyword: String): [Post]
  }
`)
