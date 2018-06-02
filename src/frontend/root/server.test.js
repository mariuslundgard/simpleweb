'use strict'

import { create as createMockGraqhql } from 'graphql-client/mock'
import supertest from 'supertest'
import { create } from './server'

describe('frontend/server', () => {
  it('should explain that there are no posts', async () => {
    const server = supertest(
      create({
        basePath: '',
        baseUrl: 'http://test',
        graphQLClient: createMockGraqhql({
          posts: []
        }),
        manifest: {
          'app.css': 'app.css',
          'app.js': 'app.js'
        },
        pubsub: {}
      })
    )

    const res = await server.get('/')

    expect(res.text).toContain(';link.href = "/app.css";')
    expect(res.text).toContain(
      '<h1 class="ml-home__title">Nothing to see (yet)</h1>'
    )
  })
})
