// @flow

import { parse as parseQuery, stringify as stringifyQuery } from 'qs'

function create () {
  return (store: any) => {
    window.addEventListener('popstate', () => {
      const query = parseQuery(location.search.substr(1))

      store.dispatch({
        type: 'route/NAVIGATE',
        path: location.pathname,
        query,
        popstate: true
      })
    })

    return (next: any) => (action: any) => {
      if (action.type === 'route/NAVIGATE') {
        if (!action.popstate) {
          window.history.pushState(
            null,
            null,
            `${action.path}${
              Object.keys(action.query).length
                ? '?' + stringifyQuery(action.query)
                : ''
            }`
          )
        }
      }

      next(action)
    }
  }
}

export default { create }
