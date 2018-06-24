// @flow @jsx h

import express from 'express'
import layout from 'layout'
import { h } from 'preact'
import render from 'preact-render-to-string'

import DownScreen from './screens/DownScreen'

import type { $Request, $Response } from 'express'
import type { Config } from 'types'

function create (config: Config) {
  const { baseUrl, manifest } = config
  const app = express()

  const data = {
    title: 'I’m busy working',
    description: 'Please come back soon…'
  }

  app.get('/*', (req: $Request, res: $Response) => {
    res.send(
      layout({
        baseUrl,
        meta: DownScreen.meta(data),
        head: `<link rel="stylesheet" href="/${manifest['maintenance.css']}">`,
        body: `<div id="ml-root">${render(<DownScreen {...data} />)}</div>`
      })
    )
  })

  return app
}

export { create }
export default { create }
