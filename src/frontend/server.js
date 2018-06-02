// @flow @jsx h

import express from 'express'
import { h } from 'preact'
import { render } from 'preact-render-to-string'
import App from './App'
import layout from './lib/layout'
import { matchRoute } from './routes'
import screens, { NotFound } from './screens'
import DownScreen from './screens/DownScreen'
import ErrorScreen from './screens/ErrorScreen'

import type { $Request, $Response } from 'express'
import type { Meta } from './types'
import type { Config } from '../types'

function createUpHandler (config: Config) {
  const { apiClient, baseUrl, manifest } = config

  return async (req: $Request, res: $Response) => {
    const { query } = req

    try {
      const { name, params } = matchRoute(req.path)
      const Screen = (name && screens[name]) || NotFound
      const statePromise =
        typeof Screen.query === 'function'
          ? apiClient.query(Screen.query(params, query))
          : Promise.resolve({ data: null, errors: null })
      const state = await statePromise

      if (!state.data) {
        res.send('No data')
        return
      }

      const props = {
        mode: 'server',
        baseUrl,
        params,
        query,
        ...state
      }
      const encodedProps = encodeURIComponent(JSON.stringify(props))
      const meta: Meta | null = Screen.meta(state.data, params, query)

      if (!meta) {
        res.json(state)
        return
      }

      res.send(
        layout({
          meta,
          baseUrl,
          head: `<link rel="stylesheet" href="/${manifest['app.css']}">`,
          body: [
            `<div id="ml-root" data-encoded-props="${encodedProps}">`,
            render(<App {...props} {...state} Screen={Screen} />),
            '</div>',
            `<script type="module" src="/module/${
              manifest['app.js']
            }"></script>`,
            '<script nomodule src="https://unpkg.com/systemjs@0.21.0/dist/system-production.js"></script>',
            `<script nomodule>System.import("/nomodule/${
              manifest['app.js']
            }")</script>`
          ].join('')
        })
      )
    } catch (err) {
      console.error(err.stack)
      const data = {
        title: 'I’m sorry!',
        description: 'Something went dreadfully wrong…'
      }
      const meta = ErrorScreen.meta(data)
      res.status(meta.status || 500)
      res.send(
        layout({
          baseUrl,
          meta: {
            ...meta,
            url: req.path
          },
          head: `<link rel="stylesheet" href="/${manifest['app.css']}">`,
          body: [
            `<div id="ml-root">`,
            render(<ErrorScreen {...data} />),
            '</div>'
          ].join('')
        })
      )
    }
  }
}

function createDownHandler (config: Config) {
  const { baseUrl, manifest } = config

  return (req: $Request, res: $Response) => {
    const data = {
      title: 'I’m busy working',
      description: 'Please come back soon…'
    }
    const meta = DownScreen.meta(data)

    res.send(
      layout({
        baseUrl,
        meta: {
          ...meta,
          url: req.path
        },
        head: `<link rel="stylesheet" href="/${manifest['app-down.css']}">`,
        body: [
          `<div id="ml-root">`,
          render(<DownScreen {...data} />),
          '</div>'
        ].join('')
      })
    )
  }
}

function create (config: Config) {
  const { features } = config
  const router = express()

  if (features.live) {
    router.get('/*', createUpHandler(config))
  } else {
    const upHandler = createUpHandler(config)
    const downHandler = createDownHandler(config)

    router.get('/*', (req: $Request, res: $Response, next) => {
      if (req.query.up !== undefined) {
        upHandler(req, res)
      } else {
        downHandler(req, res)
      }
    })
  }

  return router
}

export { create }
export default { create }
