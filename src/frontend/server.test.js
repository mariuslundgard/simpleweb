'use strict'

import supertest from 'supertest'
import { create } from './server'

describe('frontend/server', () => {
  it('should show a message when `live` feature is off', async () => {
    const server = supertest(
      create({
        features: {
          live: false
        },
        manifest: {
          'app-down.css': 'app-down.css'
        }
      })
    )

    const res = await server.get('/')

    expect(res.text).toContain('<link rel="stylesheet" href="/app-down.css">')
    expect(res.text).toContain(
      '<h1 class="ml-down-screen__title">I’m busy working</h1>'
    )
  })

  it('should show load message when no data was fetched', async () => {
    const server = supertest(
      create({
        apiClient: {
          query: () => Promise.resolve({ data: null, errors: null })
        },
        baseUrl: 'http://test',
        features: {
          live: true
        },
        manifest: {
          'app.css': 'app.css',
          'app.js': 'app.js'
        }
      })
    )

    const res = await server.get('/')

    expect(res.text).toEqual('No data')
  })

  it('should show load message when no data was fetched', async () => {
    const server = supertest(
      create({
        apiClient: {
          query: () =>
            Promise.resolve({
              data: {
                articles: [],
                projects: []
              },
              errors: null
            })
        },
        baseUrl: 'http://test',
        features: {
          live: true
        },
        manifest: {
          'app.css': 'app.css',
          'app.js': 'app.js'
        }
      })
    )

    const res = await server.get('/')

    expect(res.text).toContain('<link rel="stylesheet" href="/app.css">')
    expect(res.text).toContain('%22baseUrl%22%3A%22http%3A%2F%2Ftest%22')
    expect(res.text).toContain('<div class="ml-home"></div>')
    expect(res.text).toContain('<script type="module" src="/module/app.js">')
  })
})
