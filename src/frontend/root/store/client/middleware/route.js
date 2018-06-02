// @flow

import { parse as parseQuery, stringify as stringifyQuery } from 'qs'
import { matchRoute } from '../../../app'

function create (opts: any) {
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

    function loadScreenData (screen, params, query) {
      if (screen.load) {
        store.dispatch(screen.load(params, query))
      }
    }

    function loadScreen (action: any, opts: any) {
      return {
        cancel () {
          console.log('cancel')
        },

        success (fn: any) {
          const route = matchRoute(action.path, opts.basePath)

          if (opts.screens[route.name]) {
            fn(route, opts.screens[route.name])
            loadScreenData(opts.screens[route.name], route.params, action.query)
            return
          }

          opts.importScreenModule(route.name).then(mod => {
            opts.screens[route.name] = mod.default
            fn(route, opts.screens[route.name])
            loadScreenData(opts.screens[route.name], route.params, action.query)
          })
        }
      }
    }

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

        store.dispatch({ type: 'route/LOAD_SCREEN' })

        const ctx = loadScreen(action, opts)

        ctx.success(route => {
          store.dispatch({ type: 'route/LOAD_SCREEN_SUCCESS' })
          next(action)
        })
      } else {
        next(action)
      }
    }
  }
}

export default { create }
