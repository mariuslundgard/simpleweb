// @flow

export type Logger = {
  info: Function,
  error: Function
}

export type Config = {
  admin: {
    user: string,
    pass: string
  },
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
}
