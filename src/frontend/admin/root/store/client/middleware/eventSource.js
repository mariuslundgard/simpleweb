// @flow

import superagent from 'superagent'

function create (opts: any) {
  return (store: any) => (next: any) => (action: any) => {
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

      eventSource.addEventListener('message', evt => {
        const msg = JSON.parse(evt.data)
        store.dispatch(msg)
      })

      eventSource.addEventListener('error', err => {
        console.error(err)
      })
    }

    return next(action)
  }
}

export default { create }
