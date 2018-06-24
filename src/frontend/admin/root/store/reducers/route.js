import matchRoute from '../../matchRoute'

const DEFAULT = {
  name: null,
  params: {}
}

export default function route (state = DEFAULT, msg) {
  // console.log(msg)

  switch (msg.type) {
    case 'route/NAVIGATE':
      return { ...state, ...matchRoute(msg.path, msg.query) }
    default:
      return state
  }
}
