import { matchRoute } from '../../app'

const DEFAULT = {
  basePath: '',
  name: null,
  params: {},
  path: null
}

export default function route (state = DEFAULT, msg) {
  switch (msg.type) {
    case 'route/NAVIGATE': {
      return {
        ...state,
        ...matchRoute(msg.path, state.basePath),
        path: msg.path
      }
    }

    default:
      return state
  }
}
