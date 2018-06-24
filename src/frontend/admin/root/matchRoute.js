// @flow

function matchRoute (path: string) {
  switch (true) {
    case path === '/':
      return { name: 'home', params: {} }
    default:
      return { name: null, params: {} }
  }
}

export default matchRoute
