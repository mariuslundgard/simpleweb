// @flow @jsx h

import express from 'express'
import layout from 'layout'
import { h } from 'preact'
import { Provider } from 'preact-redux'
import { render } from 'preact-render-to-string'
import { createStore } from './store/server'
import { Root } from './app'
import screens from './screens'
import ErrorScreen from './screens/ErrorScreen'

import type { $Request, $Response } from 'express'
import type { GraphQLClient } from 'graphql-client'
import type { Config, Features } from 'types'
import type { Route } from './types'

type FrontendConfig = Config & {
  basePath: string,
  features: Features,
  graphQLClient: GraphQLClient
}

function resolveScreen (route: Route): any {
  let screen = screens.notFound

  if (route.name && screens[route.name]) {
    screen = screens[route.name]
  }

  return screen
}

function renderScreen (config: FrontendConfig, Screen, store) {
  const { basePath, baseUrl, manifest } = config

  const html = render(
    <Provider store={store}>
      <Root mode='server' screens={screens} />
    </Provider>
  )

  const state = store.getState()
  const encodedState = encodeURIComponent(JSON.stringify(state))

  // prettier-ignore
  return layout({
    criticalStyles: Screen.criticalStyles,
    meta: Screen.meta(state),
    baseUrl,
    head: [
      // '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Libre+Franklin:400,400i,500,500i,700,700i,900,900i">',
      `<script>`,
      `(function () {`,
      `var link = document.createElement('link');`,
      `link.rel = "stylesheet";`,
      `link.href = "/${manifest['app.css']}";`,
      `document.head.appendChild(link);`,
      `})()`,
      `</script>`
    ].join(''),
    body: [
      `<div id="ml-root" data-base-url="${baseUrl}" data-base-path="${basePath || ''}" data-state="${encodedState}">${html}</div>`,
      `<script type="module" src="/module/${manifest['app.js']}"></script>`,
      '<script nomodule src="https://unpkg.com/systemjs@0.21.0/dist/system-production.js"></script>',
      `<script nomodule>System.import("/nomodule/${
        manifest['app.js']
      }")</script>`
    ].join('')
  })
}

function getScreenState (Screen, route, store) {
  return new Promise(resolve => {
    if (!Screen.load) {
      resolve()
      return
    }

    store.dispatch(Screen.load(route.params, route.query))

    const unsubscribe = store.subscribe(() => {
      const state = store.getState()

      if (Screen && Screen.isLoading && !Screen.isLoading(state)) {
        unsubscribe()
        resolve()
      }
    })
  })
}

function create (config: FrontendConfig) {
  const { basePath, features, graphQLClient } = config
  const app = express()

  app.disable('x-powered-by')

  app.get('/*', async (req: $Request, res: $Response) => {
    const store = createStore(
      { features, route: { basePath } },
      {
        graphql: { client: graphQLClient },
        route: { basePath, screens }
      }
    )

    try {
      store.dispatch({
        type: 'route/NAVIGATE',
        path: req.path,
        query: req.query
      })

      const { route } = store.getState()
      const Screen = resolveScreen(route)

      await getScreenState(Screen, route, store)

      res.send(renderScreen(config, Screen, store))
    } catch (err) {
      res.status(err.status || 500)

      store.dispatch({
        type: 'route/ERROR',
        error: { message: err.message, stack: err.stack }
      })

      res.send(renderScreen(config, ErrorScreen, store))
    }
  })

  return app
}

export { create }
export default { create }
