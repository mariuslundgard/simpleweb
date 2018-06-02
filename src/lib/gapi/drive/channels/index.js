'use strict'

const request = require('request')

const API_URL = 'https://www.googleapis.com/drive/v3/channels'

exports.stop = opts =>
  new Promise((resolve, reject) => {
    const { token, channel } = opts
    return request.post(
      {
        headers: {
          Authorization: `${token.token_type} ${token.access_token}`
        },
        url: `${API_URL}/stop`,
        json: true,
        body: channel
      },
      (err, res, body) => {
        if (err) {
          reject(err)
        } else {
          if (res.statusCode >= 400) {
            const err = new Error(body.error.message)
            reject(err)
          } else {
            resolve(body || 'ok')
          }
        }
      }
    )
  })
