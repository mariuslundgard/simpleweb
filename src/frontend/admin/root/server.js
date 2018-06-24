// @flow @jsx h

import express from 'express'
import auth from 'http-auth'
import { h } from 'preact'
import { Provider } from 'preact-redux'
import render from 'preact-render-to-string'
import { createStore } from './store/server'
import { Root } from './app'
import screens from './screens'
import { navigate } from './store/actions'

import type { $Request, $Response } from 'express'
import type { AdminConfig } from '../server'

function renderApp (store) {
  const state = store.getState()
  const encodedState = encodeURIComponent(JSON.stringify(state))
  const html = render(
    <Provider store={store}>
      <Root />
    </Provider>
  )

  // prettier-ignore
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Libre+Franklin:400,400i,500,500i,700,700i,900,900i">
    <link rel="stylesheet" href="/admin.css">
  </head>
  <body>
    <div id="ml-root" data-state="${encodedState}">${html}</div>
    <script type="module" src="/module/admin.js"></script>
    <script nomodule src="https://unpkg.com/systemjs@0.21.0/dist/system-production.js"></script>
    <script nomodule>System.import("/nomodule/admin.js")</script>
  </body>
</html>`
}

function readyToRender (store, isReadyFn) {
  return new Promise(resolve => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState()

      if (isReadyFn(state)) {
        unsubscribe()
        resolve()
      }
    })
  })
}

function create (config: AdminConfig) {
  const { admin, graphQLClient } = config
  const app = express()

  const basicAuth = auth.basic(
    {
      realm: 'Studio Marius Lundgård'
    },
    (username, password, fn) => {
      // Custom authentication
      // Use callback(error) if you want to throw async error.
      fn(username === admin.user && password === admin.pass)
    }
  )

  app.get(
    '/*',
    auth.connect(basicAuth),
    async (req: $Request, res: $Response) => {
      try {
        const store = createStore({}, { graphQLClient })

        store.dispatch(navigate(req.path, req.query))

        const { route } = store.getState()
        const Screen = screens[route.name]

        if (!Screen) {
          res.send(renderApp(store))
          return
        }

        store.dispatch(Screen.load())

        await readyToRender(store, Screen.isLoaded)

        res.send(renderApp(store))
      } catch (err) {
        res.send(err.stack)
      }
    }
  )

  return app
}

export { create }
export default { create }
