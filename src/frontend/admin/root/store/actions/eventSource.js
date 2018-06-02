// @flow

export function send (msg: any) {
  return {
    type: 'eventSource/SEND',
    msg
  }
}

export function subscribe (channel: string) {
  return {
    type: 'eventSource/SUBSCRIBE',
    channel
  }
}

export function unsubscribe (channel: string) {
  return {
    type: 'eventSource/UNSUBSCRIBE',
    channel
  }
}
