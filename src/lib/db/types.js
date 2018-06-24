// @flow

import type { Client, Features, Post, Task } from 'types'

export type ClientsResolver = {
  findOne: (
    params: any,
    // eslint-disable-next-line no-use-before-define
    db: DbClient,
    fieldNode: any
  ) => Promise<Client | null>,
  findAll: (
    params: any,
    // eslint-disable-next-line no-use-before-define
    db: DbClient,
    fieldNode: any
  ) => Promise<Client[] | null>
}

export type FeaturesResolver = {
  get: (key: string) => Promise<boolean>,
  set: (key: string, value: boolean) => Promise<void>,
  toggle: (key: string) => Promise<void>,
  find: (params: any, db: any, fieldNode: any) => Promise<Features | null>
}

export type PostsResolver = {
  findOne: (params: any, db: any, fieldNode: any) => Promise<Post | null>,
  findAll: (params: any, db: any, fieldNode: any) => Promise<Post[] | null>
}

export type TasksResolver = {
  create: (type: string, payload: any) => Promise<Task>,
  get: (id: string) => Promise<Task | null>,
  save: (task: Task) => Promise<void>,
  findAll: (params: any, db: any, fieldNode: any) => Promise<Task[]>
}

export type DbClient = {
  clients: ClientsResolver,
  features: FeaturesResolver,
  modifiedTime: any,
  posts: PostsResolver,
  tasks: TasksResolver
}
