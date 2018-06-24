// @flow

type TaskError = {
  message: string
}

export type QueuedTask = {|
  status: 'queued',
  type: string,
  id: string,
  payload?: any,
  created: number
|}

export type StartedTask = {|
  status: 'started',
  type: string,
  id: string,
  payload?: any,
  created: number,
  started: number
|}

export type CompletedTask = {|
  status: 'completed',
  type: string,
  id: string,
  payload?: any,
  created: number,
  started: number,
  completed: number
|}

export type FailedTask = {|
  status: 'failed',
  type: string,
  id: string,
  payload?: any,
  created: number,
  started: number,
  failed: number,
  error: TaskError
|}

export type Task = QueuedTask | StartedTask | CompletedTask | FailedTask
