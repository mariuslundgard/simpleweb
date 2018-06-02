// @flow

import superagent from 'superagent'

function create (opts: any) {
  const subscriptions = {}

  return (store: any) => (next: any) => (action: any) => {
    if (action.type === 'eventSource/SEND') {
      superagent
        .post('/events')
        .send(action.msg)
        .then(() => {
          console.log('sent')
        })
    }

    if (action.type === 'eventSource/SUBSCRIBE') {
      console.log(`subscribe to EventSource#${action.channel}`)

      const eventSource = new window.EventSource(`/events/${action.channel}`)

      subscriptions[action.channel] = eventSource

      eventSource.addEventListener('message', evt => {
        const msg = JSON.parse(evt.data)
        store.dispatch(msg)
      })

      eventSource.addEventListener('error', err => {
        console.log(err)
      })
    }

    if (action.type === 'eventSource/UNSUBSCRIBE') {
      if (subscriptions[action.channel]) {
        console.log(`unsubscribe to EventSource#${action.channel}`)
        subscriptions[action.channel].close()
        delete subscriptions[action.channel]
      }
    }

    return next(action)
  }
}

export default { create }
