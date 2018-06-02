// @flow

import type { Client, Features, Task } from 'types'

type Error = {
  message: string
}

export type HomeState = {
  data: {
    clients: Client[] | null
  },
  errors: Error[] | null,
  isLoading: boolean,
  isLoaded: boolean,
  isFailed: boolean
}

export type TasksState = {
  data: {
    tasks: Task[] | null
  },
  errors: Error[] | null,
  isLoading: boolean,
  isLoaded: boolean,
  isFailed: boolean
}

export type FeaturesState = {
  data: {
    features: Features | null
  },
  errors: Error[] | null,
  isLoading: boolean,
  isLoaded: boolean,
  isFailed: boolean
}

export type RouteState = {
  basePath: string,
  path: string,
  name: string | null,
  params: any,
  query: any
}

export type GlobalState = {
  home: HomeState,
  route: RouteState
}
