'use strict'

import { create as createMockGraqhql } from 'graphql-client/mock'
import supertest from 'supertest'
import { create } from './server'

describe('frontend/admin/server/root', () => {
  it('should show unauthorized message', async () => {
    const server = supertest(
      create({
        admin: {
          user: 'test',
          pass: 'test'
        }
      })
    )

    const res = await server.get('/')

    expect(res.status).toEqual(401)
    expect(res.text).toEqual('401 Unauthorized')
  })

  it('should show dashboard when logged in', async () => {
    const server = supertest(
      create({
        admin: {
          user: 'test',
          pass: 'test'
        },
        basePath: '',
        baseUrl: 'http://test',
        graphQLClient: createMockGraqhql({
          features: {
            maintenance: false,
            projects: false
          },
          posts: []
        }),
        manifest: {
          'admin.css': 'admin.css',
          'admin.js': 'admin.js'
        }
      })
    )

    const res = await server.get('/').auth('test', 'test')

    expect(res.status).toEqual(200)
    expect(res.text).toContain('<div class="ml-home"><h1>Admin</h1>')
  })
})
