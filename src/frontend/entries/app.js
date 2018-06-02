// @flow @jsx h

import { h, render } from 'preact'
import App from '../App/index'
import { matchRoute } from '../routes'

const elm: any = document.querySelector('#web-root')

if (!elm) {
  throw new Error('Could not locate root element #web-root')
}

const encodedProps = elm.getAttribute('data-encoded-props')
const props = encodedProps ? JSON.parse(decodeURIComponent(encodedProps)) : {}
const route = matchRoute(location.pathname)

importScreenModule(route.name).then(mod => {
  render(
    <App
      {...props}
      Screen={mod.default}
      importScreenModule={importScreenModule}
      mode='browser'
    />,
    elm,
    elm.firstChild
  )
})

function importScreenModule (name) {
  switch (name) {
    case 'article':
      return import('./article.js')
    case 'blog':
      return import('./blog.js')
    case 'home':
      return import('./home.js')
    case 'project':
      return import('./project.js')
    default:
      return import('./not-found.js')
  }
}
