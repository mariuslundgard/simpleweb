// @flow

import { buildSchema } from 'graphql'

export default buildSchema(`
  scalar Date
  scalar PostContent

  type Client {
    id: String!
    ip: String!
  }

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

  scalar TaskPayload
  scalar Error

  type Task {
    type: String!
    id: String!
    status: String!
    created: Date
    started: Date
    completed: Date
    failed: Date
    payload: TaskPayload
    error: Error
  }

  type Features {
    maintenance: Boolean!
    projects: Boolean!
  }

  type Query {
    clients: [Client]
    features: Features!
    modifiedTime: Date
    post(id: String!): Post
    posts(type: String, sort: String, order: String, keyword: String): [Post]
    tasks: [Task]
  }
`)
