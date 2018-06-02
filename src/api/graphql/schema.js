// @flow

import { buildSchema } from 'graphql'

export default buildSchema(`
  scalar Date
  scalar PostContent

  type Image {
    id: String
    alt: String
  }

  type Post {
    id: String!
    type: String!
    mimeType: String!
    trashed: Boolean!
    name: String!
    title: String
    image: Image
    description: String
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
