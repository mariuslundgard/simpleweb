// @flow

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

export const load = (keyword: string) => {
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
