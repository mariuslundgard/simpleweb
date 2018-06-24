// @flow

import type { Task } from 'types'

export function navigate (path: string, query: any) {
  return {
    type: 'route/NAVIGATE',
    path,
    query
  }
}

export function sendEventSource (msg: any) {
  return {
    type: 'eventSource/SEND',
    msg
  }
}

export function subscribeEventSource (channel: 'home') {
  return {
    type: 'eventSource/SUBSCRIBE',
    channel
  }
}

export function registerFeature (key: string, value: boolean) {
  return {
    type: 'features/REGISTER',
    key,
    value
  }
}

export function registerTask (task: Task) {
  return {
    type: 'tasks/REGISTER',
    task
  }
}

const loadHomeQuery = () => `{
  clients {
    id
    ip
  }
  features {
    maintenance
    projects
  }
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
export function loadHome () {
  return {
    type: 'graphql/QUERY',
    types: ['home/LOAD', 'home/LOAD_SUCCESS', 'home/LOAD_ERROR'],
    query: loadHomeQuery()
  }
}
