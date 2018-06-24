// @flow

import superagent from 'superagent'

function create (opts: any) {
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
      const eventSource = new window.EventSource(`/events/${action.channel}`)

      eventSource.addEventListener('message', evt => {
        const msg = JSON.parse(evt.data)
        store.dispatch(msg)
      })

      eventSource.addEventListener('error', err => {
        console.log(err)
      })
    }

    return next(action)
  }
}

export default { create }
