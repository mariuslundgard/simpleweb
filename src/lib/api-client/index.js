// @flow

import superagent from 'superagent'

type Opts = {
  baseUrl: string
}

function create (opts: Opts) {
  const query = (q: string) =>
    superagent
      .post(`${opts.baseUrl}/graphql?query=${q}`)
      .then(res => res.body)
      .catch(err => {
        if (err.response && err.response.body) {
          const apiErr: any = new Error('query failed')
          apiErr.status = 500
          apiErr.errors = err.response.body.errors
          return Promise.reject(apiErr)
        }
        return Promise.reject(err)
      })

  const get = (p: string) =>
    superagent.get(`${opts.baseUrl}${p}`).then(res => res.body)

  return { query, get }
}

export { create }
export default { create }
