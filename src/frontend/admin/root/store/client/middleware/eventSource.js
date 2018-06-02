// @flow

import superagent from 'superagent'

import type { FrontendMsg, ServerMsg } from '../../../../types'

type SendEventSource = {
  type: 'eventSource/SEND',
  msg: FrontendMsg
}

type SubscribeEventSource = {
  type: 'eventSource/SUBSCRIBE',
  channel: string
}

type UnsubscribeEventSource = {
  type: 'eventSource/UNSUBSCRIBE',
  channel: string
}

type Action = SendEventSource | SubscribeEventSource | UnsubscribeEventSource

function create () {
  const subscriptions = {}

  return (store: any) => (next: any) => (action: Action) => {
    if (action.type === 'eventSource/SEND') {
      superagent
        .post('/admin/events')
        .send(action.msg)
        .catch(err => {
          console.error(err)
        })
    }

    if (action.type === 'eventSource/SUBSCRIBE') {
      const eventSource = new window.EventSource(
        `/admin/events/${action.channel}`
      )

      subscriptions[action.channel] = eventSource

      eventSource.addEventListener('message', evt => {
        const msg: ServerMsg = JSON.parse(evt.data)
        store.dispatch(msg)
      })

      eventSource.addEventListener('error', err => {
        console.error(err)
      })
    }

    if (action.type === 'eventSource/UNSUBSCRIBE') {
      if (subscriptions[action.channel]) {
        // console.log(`unsubscribe to EventSource#${action.channel}`)
        subscriptions[action.channel].close()
        delete subscriptions[action.channel]
      }
    }

    return next(action)
  }
}

export default { create }
