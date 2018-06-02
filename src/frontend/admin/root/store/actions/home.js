// @flow

const loadQuery = () => `{
  clients {
    id
    ip
    channel
  }
  features {
    maintenance
    projects
  }
  tasks {
    id
    type
    status
    created
    started
    completed
    failed
    payload
    error
  }
}`

export function load () {
  return {
    type: 'graphql/QUERY',
    types: ['home/LOAD', 'home/LOAD_SUCCESS', 'home/LOAD_ERROR'],
    query: loadQuery()
  }
}
