// @flow @jsx h

import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import { createStore } from '../store/client'
import { Root } from '../app'

const elm: any = document.querySelector('#ml-root')
const encodedState = elm.getAttribute('data-state')
const state = JSON.parse(decodeURIComponent(encodedState))
const store = createStore(state, {
  apiClient: {
    query: q => fetch(`/api/graphql?query=${q}`).then(res => res.json())
  },
  eventSource: {
    home: '/events/home'
  }
})

render(
  <Provider store={store}>
    <Root />
  </Provider>,
  elm,
  elm.firstChild
)
