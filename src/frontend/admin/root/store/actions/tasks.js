// @flow

import type { Task } from 'types'

export function register (task: Task) {
  return {
    type: 'tasks/REGISTER',
    task
  }
}

const loadQuery = () => `{
  tasks {
    id
    type
    status
    created
    started
    completed
    failed
    payload
    error
  }
}`

export function load () {
  return {
    type: 'graphql/QUERY',
    types: ['tasks/LOAD', 'tasks/LOAD_SUCCESS', 'tasks/LOAD_ERROR'],
    query: loadQuery()
  }
}
