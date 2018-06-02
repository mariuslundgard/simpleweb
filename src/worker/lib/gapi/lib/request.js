'use strict'

const request = require('request')

exports.makeRequest = opts =>
  new Promise((resolve, reject) => {
    // console.log(opts)
    // console.log(opts.method || 'GET', opts.url)

    request.get(opts, (reqErr, res, body) => {
      if (reqErr) {
        reject(reqErr)
      } else {
        // console.log(res.headers['content-type'])

        const isJSON =
          res.headers['content-type'] &&
          res.headers['content-type'].indexOf('application/json') > -1
        // console.log(res.headers)

        if (res.statusCode >= 400) {
          const err = new Error(String(res.statusCode))
          err.data = body
          reject(err)
        } else if (res.statusCode >= 400) {
          const data = isJSON ? JSON.parse(body) : body
          const err = new Error(data.error_description)

          // console.log(data);

          err.data = data
          err.code = res.statusCode

          reject(err)
        } else {
          const data = isJSON ? JSON.parse(body) : body
          resolve(data)
        }
      }
    })
  })
