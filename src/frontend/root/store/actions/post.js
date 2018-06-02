// @flow

const postQuery = id => `{
  post(id: "${id}") {
    type
    id
    name
    image {
      id
      alt
    }
    title
    description
    content
    modifiedTime
    publishedTime
    keywords
  }
}`

export const load = (id: string) => ({
  type: 'graphql/QUERY',
  types: ['post/LOAD', 'post/LOAD_SUCCESS', 'post/LOAD_ERROR'],
  query: postQuery(id)
})
