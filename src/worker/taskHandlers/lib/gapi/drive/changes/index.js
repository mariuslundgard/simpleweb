'use strict'

const qs = require('qs')
const request = require('request')
const { makeRequest } = require('../../lib/request')

const API_URL = 'https://www.googleapis.com/drive/v3/changes'

const LIST_OPTS = [
  'includeCorpusRemovals',
  'includeRemoved',
  'includeTeamDriveItems',
  'pageSize',
  'pageToken',
  'restrictToMyDrive',
  'spaces',
  'supportsTeamDrives',
  'alt'
]
exports.list = opts => {
  const { token } = opts
  const headers = {
    Authorization: `${token.token_type} ${token.access_token}`
  }

  const query = {}

  LIST_OPTS.forEach(key => {
    if (opts[key]) {
      query[key] = opts[key]
    }
  })

  return makeRequest({
    headers,
    url: API_URL + `?${qs.stringify(query)}`
  })
}

exports.watch = opts => {
  return new Promise((resolve, reject) => {
    const { id, address, pageToken, token } = opts
    const headers = {
      Authorization: `${token.token_type} ${token.access_token}`
    }

    const payload = {
      id,
      type: 'web_hook',
      address
    }

    if (opts.resourceId) {
      payload.resourceId = opts.resourceId
    }

    if (opts.expiration) {
      payload.expiration = opts.expiration
    }

    const requestOpts = {
      headers,
      url: `${API_URL}/watch?pageToken=${pageToken}`,
      json: true,
      body: payload
    }

    request.post(requestOpts, (err, res, body) => {
      if (err) {
        reject(err)
      } else {
        if (res.statusCode >= 400) {
          const err = new Error(body.error.message)
          reject(err)
        } else {
          resolve(body)
        }
      }
    })
  })
}

exports.getStartPageToken = opts => {
  const { token } = opts
  return makeRequest({
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`
    },
    url: `${API_URL}/startPageToken`
  }).then(result => result.startPageToken)
}
