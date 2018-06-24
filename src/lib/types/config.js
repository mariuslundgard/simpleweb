// @flow

export type Logger = {
  info: Function,
  error: Function
}

export type APIClient = {
  query: (query: string) => Promise<any>
}

export type Config = {
  admin: {
    user: string,
    pass: string
  },
  apiClient: APIClient,
  baseUrl: string,
  cache: Cache,
  manifest: {
    [key: string]: string
  },
  google: {
    channelExpiration: number,
    credentials: any,
    rootFolderId: string
  },
  graphiql: boolean,
  logger: Logger,
  redis: {
    url: string
  }
  // queue: Queue,
  // pubsub: PubSub
}
