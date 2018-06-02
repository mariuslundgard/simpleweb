// @flow @jsx h

import { Router } from 'express'
import layout from './lib/layout'
import { h } from 'preact'
import { render } from 'preact-render-to-string'
import request from 'request'
import { matchRoute } from './routes'
import App from './App'
import screens, { NotFound } from './screens'

import style from './client.css'

import type { $Request, $Response } from 'express'
import type { Config } from '../types'

export default { create }

function create (config: Config) {
  const { manifest } = config
  const router = Router()

  function query (q: string) {
    return new Promise((resolve, reject) => {
      request.post(
        {
          url: `http://localhost:3000/api/graphql?query=${q}`
        },
        (err, res, text) => {
          if (err) {
            reject(err)
          } else {
            resolve(JSON.parse(text))
          }
        }
      )
    })
  }

  router.get('/*', async (req: $Request, res: $Response) => {
    try {
      const baseUrl = 'http://localhost:3000'
      const route = matchRoute(req.path)
      const Screen = (route.name && screens[route.name]) || NotFound
      const statePromise =
        typeof Screen.query === 'function'
          ? query(Screen.query(route.params, req.query))
          : Promise.resolve({ data: null, errors: null })
      const state = await statePromise
      const props = {
        baseUrl,
        mode: 'server',
        ...state,
        params: route.params,
        query: req.query
      }
      const encodedProps = encodeURIComponent(JSON.stringify(props))

      res.send(
        layout({
          lang: 'en',
          title: `App – node-hipster-starter`,
          // head: `<link rel="stylesheet" href="/${
          //   config.manifest['main.css']
          // }">`,
          head: [
            '<style>',
            'body { font: 16px/1.2 -apple-system, BlinkMacSystemFont, sans-serif }',
            'a { color: inherit }',
            'hr { height: 1px; border: 0; background: currentColor }',
            '.web-app { max-width: 540px; margin: 0 auto }',
            '.web-app--is-server { color: #999 }',
            '.web-app--is-loading-screen { color: #999 }',
            '</style>'
          ].join(''),
          body: [
            `<div id="${style.root}" data-encoded-props="${encodedProps}">`,
            render(<App {...props} {...state} Screen={Screen} />),
            '</div>',
            `<script type="module" src="/module/${
              manifest['app.js']
            }"></script>`,
            '<script nomodule src="https://unpkg.com/systemjs@0.21.0/dist/system-production.js"></script>',
            `<script nomodule>System.import("/nomodule/${
              manifest['app.js']
            }")</script>`
            // '<script src="https://unpkg.com/systemjs@0.21.0/dist/system-production.js"></script>',
            // '<script>System.import("/nomodule/app-dev.js")</script>'
          ].join('')
        })
      )
    } catch (err) {
      res.status(500)
      res.send(err.stack)
    }
  })

  return router
}
