'use strict'

const jwt = require('jsonwebtoken')
const request = require('request')

const GAPI_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token'

exports.token = opts =>
  new Promise((resolve, reject) => {
    const { credentials, scopes } = opts
    const issued = Math.floor(new Date().getTime() / 1000)

    const payload = {
      iss: credentials.client_email,
      scope: scopes.join(','),
      aud: GAPI_TOKEN_URL,
      exp: issued + 60 * 60, // In 1 hour
      iat: issued
    }

    const token = jwt.sign(payload, credentials.private_key, {
      algorithm: 'RS256'
    })

    const grantType = 'urn:ietf:params:oauth:grant-type:jwt-bearer'

    request.post(
      {
        url: GAPI_TOKEN_URL,
        form: {
          grant_type: grantType,
          assertion: token
        }
      },
      (reqErr, res, body) => {
        if (reqErr) {
          reject(reqErr)
        } else {
          const data = JSON.parse(body)

          if (res.statusCode >= 400) {
            const err = new Error(data.error_description)

            err.code = res.statusCode

            reject(err)
          } else {
            resolve(data)
          }
        }
      }
    )
  })
