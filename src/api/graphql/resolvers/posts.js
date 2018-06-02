// @flow

// import { getFields } from './_helpers'

import type { Opts } from './_types'

export default { create }

async function fetchPosts (cache) {
  const postIds = await cache.smembers('post_ids')

  if (!postIds) {
    return null
  }

  const posts = await Promise.all(
    postIds.map(id => {
      return cache
        .get(`posts:${id}`)
        .then(text => (text ? JSON.parse(text) : null))
    })
  )

  return posts
    .filter(Boolean)
    .filter(d => {
      return d.publishedTime
    })
    .map(d => {
      if (d.modifiedTime < d.publishedTime) {
        return { ...d, modifiedTime: null }
      }

      return d
    })
}

function create (opts: Opts) {
  const { cache } = opts

  return {
    async findOne (params: any, context: any, fieldNode: any) {
      // const fields = getFields(fieldNode)
      const posts = await fetchPosts(cache)

      if (!posts) {
        return null
      }

      const result = posts.find(post => post.id === params.id)

      if (result && result.trashed) {
        return null
      }

      return result
    },

    async findAll (params: any, context: any, fieldNode: any) {
      // const fields = getFields(fieldNode)
      const time = new Date()
      const posts = await fetchPosts(cache)

      if (!posts) {
        return null
      }

      let result = posts.slice(0)

      result = result.filter(d => d.trashed === false)

      result = result.filter(d => d.publishedTime < time.getTime())

      if (params.sort === 'publishedTime') {
        if (params.order === 'asc') {
          result.sort((a, b) => a.publishedTime - b.publishedTime)
        } else {
          result.sort((a, b) => b.publishedTime - a.publishedTime)
        }
      } else {
        result.sort((a, b) => b.publishedTime - a.publishedTime)
      }

      if (params.keyword) {
        result = result.filter(d => d.keywords.indexOf(params.keyword) > -1)
      }

      if (params.type) {
        result = result.filter(d => d.type === params.type)
      }

      return result
    }
  }
}
