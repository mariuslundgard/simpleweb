// @flow

import type { Client, Features, Task } from 'types'

type Error = {
  message: string
}

export type HomeState = {
  data: {
    clients: Client[] | null,
    tasks: Task[] | null,
    features: Features | null
  },
  errors: Error[] | null,
  isLoading: boolean,
  isLoaded: boolean,
  isFailed: boolean
}
