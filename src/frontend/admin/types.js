// @flow

type ToggleFeature = {
  type: 'features/TOGGLE',
  key: 'maintenance' | 'projects'
}

type SendClient = { type: 'clients/SEND', id: string, text: string }

type TriggerTask = {
  type: 'tasks/TRIGGER',
  key: 'sync' | 'subscribe' | 'unsubscribe'
}

export type FrontendMsg = ToggleFeature | SendClient | TriggerTask

type SubscribeSuccessEventSource = {
  type: 'eventSource/SUBSCRIBE_SUCCESS',
  channel: string
}

export type ServerMsg = SubscribeSuccessEventSource
