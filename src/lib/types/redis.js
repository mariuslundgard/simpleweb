// @flow

export type Cache = {
  keys: (pattern: string) => Promise<string[]>,
  del: (key: string) => Promise<any>,
  set: (key: string, value: any) => Promise<any>,
  get: (key: string) => Promise<any | null>,
  sadd: (key: string, value: any) => Promise<0 | 1>,
  srem: (key: string, value: string) => Promise<any>,
  expire: (key: string, seconds: number) => Promise<any>,
  smembers: (key: string) => Promise<string[] | null>
}

export type Consumer = {
  blpop: (key: string, timeout: number) => Promise<any>
}

export type Producer = {
  rpush: (key: string, value: any) => Promise<any>
}

export type Queue = {
  producer: Producer,
  consumer: Consumer
}

export type Publisher = any
export type Subscriber = any

export type PubSub = {
  publisher: Publisher,
  subscriber: Subscriber
}
