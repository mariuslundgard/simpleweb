// @flow @jsx h

import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import { parse as parseQuery } from 'qs'
import { createStore } from '../store/client'
import { Root } from '../app'

const elm = document.querySelector('#ml-root')

if (!elm) {
  throw new Error('Missing element')
}

const encodedState = elm.getAttribute('data-state')

if (!encodedState) {
  throw new Error('Missing encoded state')
}

const state = JSON.parse(decodeURIComponent(encodedState))

const opts = {
  graphql: {
    client: {
      query: q => fetch(`/api/graphql?query=${q}`).then(res => res.json())
    }
  },
  eventSource: {
    home: '/events/home'
  }
}

const store = createStore(
  { ...state, route: { ...state.route, basePath: '/admin' } },
  opts
)

function onLinkClick (evt: any) {
  evt.preventDefault()

  const target = evt.target.closest('a')
  const query = parseQuery(target.search.substr(1))

  store.dispatch({ type: 'route/NAVIGATE', path: target.pathname, query })
}

render(
  <Provider store={store}>
    <Root onLinkClick={onLinkClick} />
  </Provider>,
  elm,
  (elm.firstChild: any)
)
