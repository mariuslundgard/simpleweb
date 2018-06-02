// @flow

export type Cache = {
  del: (key: string) => Promise<any>,
  set: (key: string, value: any) => Promise<any>,
  get: (key: string) => Promise<any | null>,
  sadd: (key: string, value: any) => Promise<0 | 1>,
  keys: () => Promise<string[]>,
  expire: (key: string, seconds: number) => Promise<any>
}

export type Consumer = {
  blpop: (key: string, timeout: number) => Promise<any>
}

export type Producer = {
  rpush: (key: string, value: any) => Promise<any>
}

export type Config = {
  cache: Cache,
  manifest: {
    [key: string]: string
  },
  google: {
    credentials: any,
    rootFolderId: string
  },
  graphiql: boolean,
  queue: {
    producer: Producer,
    consumer: Consumer
  }
}
