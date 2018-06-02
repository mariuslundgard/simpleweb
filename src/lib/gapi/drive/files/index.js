'use strict'

const qs = require('qs')
const request = require('request')
const { makeRequest } = require('../../lib/request')

const API_URL = 'https://www.googleapis.com/drive/v3/files'

// const API_LIST_FIELDS = [
//   "name",
//   "fullText",
//   "mimeType",
//   "modifiedTime",
//   "viewedByMeTime",
//   "trashed",
//   "starred",
//   "parents",
//   "owners",
//   "writers",
//   "readers",
//   "sharedWithMe",
//   "properties",
//   "appProperties",
//   "visibility"
// ];

exports.list = opts => {
  const { fields, parentId, token } = opts
  const headers = {
    Authorization: `${token.token_type} ${token.access_token}`
  }

  const q = []

  if (parentId) {
    q.push(`'${parentId}' in parents`)
  }

  const query = {}

  if (q.length) {
    query.q = q.join(' and ')
  }

  if (fields) {
    query.fields = `files (${fields.join(', ')})`
  }

  return makeRequest({
    headers,
    url: API_URL + `?${qs.stringify(query)}`
  })
}

exports.get = opts => {
  const { fileId, fields, token } = opts
  const headers = {
    Authorization: `${token.token_type} ${token.access_token}`
  }

  const query = {}

  if (fields) {
    query.fields = fields.join(', ')
  }

  const reqOpts = {
    headers,
    url: `${API_URL}/${fileId}?${qs.stringify(query)}`
  }

  return makeRequest(reqOpts)
}

exports.export = opts =>
  new Promise((resolve, reject) => {
    const { fileId, mimeType, token } = opts

    const headers = {
      Authorization: `${token.token_type} ${token.access_token}`
    }

    const query = {
      mimeType: mimeType || 'text/html'
    }

    const reqOpts = {
      headers,
      url: `${API_URL}/${fileId}/export?${qs.stringify(query)}`
    }

    request.get(reqOpts, (reqErr, res, body) => {
      if (reqErr) {
        reject(reqErr)
      } else {
        if (res.statusCode >= 400) {
          reject(new Error('Not found'))
        } else if (res.statusCode >= 400) {
          const data = JSON.parse(body)
          const err = new Error(data.error_description)

          err.code = res.statusCode

          reject(err)
        } else {
          resolve(body)
        }
      }
    })
  })
