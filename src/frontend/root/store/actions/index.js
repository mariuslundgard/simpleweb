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

export const loadPost = (id: string) => ({
  type: 'graphql/QUERY',
  types: ['post/LOAD', 'post/LOAD_SUCCESS', 'post/LOAD_ERROR'],
  query: postQuery(id)
})

export function subscribeEventSource (channel: 'home') {
  return {
    type: 'eventSource/SUBSCRIBE',
    channel
  }
}

const rootQuery = () => `{
  modifiedTime
  articles: posts (type: "article") {
    id
    type
    name
    publishedTime
  }
  projects: posts (type: "project") {
    id
    type
    name
    publishedTime
  }
}`

const keywordQuery = keyword => `{
  articles: posts (keyword: "${keyword}", type: "article") {
    id
    type
    name
    publishedTime
  }
  projects: posts (keyword: "${keyword}", type: "project") {
    id
    type
    name
    publishedTime
  }
}`

export const loadHome = (keyword: string) => {
  if (keyword) {
    return {
      type: 'graphql/QUERY',
      types: ['home/LOAD', 'home/LOAD_SUCCESS', 'home/LOAD_ERROR'],
      query: keywordQuery(keyword)
    }
  }

  return {
    type: 'graphql/QUERY',
    types: ['home/LOAD', 'home/LOAD_SUCCESS', 'home/LOAD_ERROR'],
    query: rootQuery()
  }
}
