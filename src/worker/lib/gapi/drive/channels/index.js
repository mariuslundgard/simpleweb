'use strict'

const request = require('request')
// const { makeRequest } = require('../../lib/request')

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
          // console.log(body)
          if (res.statusCode >= 400) {
            const err = new Error(body.error.message)
            reject(err)
          } else {
            // console.log(res.statusCode, body)
            resolve(body || 'ok')
          }
          // console.log(body)
          // resolve(body)
        }
      }
    )
  })
