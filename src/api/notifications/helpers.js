// @flow

import camelCase from 'lodash.camelcase'

export function parseGoogleHeaders (headers: any) {
  const prefix = 'x-goog-'

  const msg = Object.keys(headers).reduce((curr, key) => {
    if (key.startsWith(prefix)) {
      const k = camelCase(key.substr(prefix.length))
      curr[k] = headers[key]
    }
    return curr
  }, {})

  if (msg.channelExpiration) {
    msg.channelExpiration = new Date(msg.channelExpiration)
  }

  return msg
}
