// @flow

export function register (key: string, value: boolean) {
  return {
    type: 'features/REGISTER',
    key,
    value
  }
}

const loadQuery = () => `{
  features {
    maintenance
    projects
  }
}`

export function load () {
  return {
    type: 'graphql/QUERY',
    types: ['features/LOAD', 'features/LOAD_SUCCESS', 'features/LOAD_ERROR'],
    query: loadQuery()
  }
}
