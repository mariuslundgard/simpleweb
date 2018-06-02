// @flow

export type Cache = {
  del: (key: string) => Promise<any>,
  set: (key: string, value: any) => Promise<any>,
  get: (key: string) => Promise<any | null>,
  sadd: (key: string, value: any) => Promise<0 | 1>,
  srem: (key: string, value: string) => Promise<any>,
  keys: () => Promise<string[]>,
  expire: (key: string, seconds: number) => Promise<any>,
  smembers: (key: string) => Promise<string[] | null>
}

export type Consumer = {
  blpop: (key: string, timeout: number) => Promise<any>
}

export type Producer = {
  rpush: (key: string, value: any) => Promise<any>
}

export type Logger = {
  info: Function,
  error: Function
}

export type APIClient = {
  query: (query: string) => Promise<any>
}

export type Config = {
  apiClient: APIClient,
  baseUrl: string,
  cache: Cache,
  features: {
    live: boolean
  },
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
  queue: {
    producer: Producer,
    consumer: Consumer
  }
}
