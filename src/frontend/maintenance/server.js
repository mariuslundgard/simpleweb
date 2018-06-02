// @flow @jsx h

import express from 'express'
import layout from 'layout'
import { h } from 'preact'
import render from 'preact-render-to-string'

import Maintenance from './screens/Maintenance'

import type { $Request, $Response } from 'express'
import type { Config } from 'types'

function create (config: Config) {
  const { baseUrl, manifest } = config
  const app = express()

  app.disable('x-powered-by')

  const data = {
    title: 'I’m busy working',
    description: 'Please come back soon…'
  }

  app.get('/*', (req: $Request, res: $Response) => {
    res.send(
      layout({
        baseUrl,
        meta: Maintenance.meta(data),
        head: [
          '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Libre+Franklin:400,400i,500,500i,700,700i,900,900i">',
          `<link rel="stylesheet" href="/${manifest['maintenance.css']}">`
        ].join(''),
        body: `<div id="ml-root">${render(<Maintenance {...data} />)}</div>`
      })
    )
  })

  return app
}

export { create }
export default { create }
