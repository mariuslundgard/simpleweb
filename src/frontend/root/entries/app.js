// @flow @jsx h

import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import { parse as parseQuery } from 'qs'
import superagent from 'superagent'
import { ErrorScreen, NotFound } from '../screens'
import { Root } from '../app'
import { createStore } from '../store/client'

const screens = { notFound: NotFound, error: ErrorScreen }
const elm: any = document.querySelector('#ml-root')

if (!elm) {
  throw new Error('Could not locate root element #ml-root')
}

const encodedState = elm.getAttribute('data-state')
const basePath = elm.getAttribute('data-base-path')
const baseUrl = elm.getAttribute('data-base-url')
const state = JSON.parse(decodeURIComponent(encodedState))
const store = createStore(state, {
  graphql: {
    client: {
      query: q =>
        superagent
          .get(`${baseUrl}/api/graphql?query=${q}`)
          .then(res => res.body)
    }
  },
  route: {
    basePath: basePath || '',
    screens,
    importScreenModule
  }
})

importScreenModule(state.route.name).then(mod => {
  screens[state.route.name] = mod.default

  render(
    <Provider store={store}>
      <Root
        baseUrl={`${baseUrl}${basePath}`}
        Screen={mod.default}
        screens={screens}
        mode='browser'
        onLinkClick={onLinkClick}
      />
    </Provider>,
    elm,
    elm.firstChild
  )
})

function onLinkClick (evt: any) {
  evt.preventDefault()

  const target = evt.target.closest('a')
  const query = parseQuery(target.search.substr(1))

  store.dispatch({ type: 'route/NAVIGATE', path: target.pathname, query })
}

function importScreenModule (name) {
  switch (name) {
    case 'article':
      return import('./article.js')
    case 'home':
      return import('./home.js')
    case 'project':
      return import('./project.js')
    case 'error':
      return Promise.resolve({ default: ErrorScreen })
    default:
      return Promise.resolve({ default: NotFound })
  }
}
