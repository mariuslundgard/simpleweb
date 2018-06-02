// @flow

// import { getFields } from './_helpers'

import type { Opts } from './_types'

export default { create }

async function getPosts (cache) {
  const rawPosts = await cache.get('posts')

  if (!rawPosts) {
    return null
  }

  const posts = JSON.parse(rawPosts)

  return posts.map(d => ({
    ...d,
    publishedTime: d.publishedTime ? new Date(d.publishedTime) : null,
    modifiedTime: d.modifiedTime ? new Date(d.modifiedTime) : null
  }))
}

function create (opts: Opts) {
  const { cache } = opts

  return {
    async findOne (params: any, context: any, fieldNode: any) {
      // const fields = getFields(fieldNode)
      const posts = await getPosts(cache)

      if (!posts) {
        return null
      }

      const result = posts.find(post => post.id === params.id)

      return result
    },

    async findAll (params: any, context: any, fieldNode: any) {
      // const fields = getFields(fieldNode)
      const posts = await getPosts(cache)

      if (!posts) {
        return null
      }

      let result = posts.slice(0)

      if (params.sort === 'publishedTime') {
        if (params.order === 'asc') {
          result.sort(
            (a, b) => a.publishedTime.getTime() - b.publishedTime.getTime()
          )
        } else {
          result.sort(
            (a, b) => b.publishedTime.getTime() - a.publishedTime.getTime()
          )
        }
      } else {
        result.sort(
          (a, b) => b.publishedTime.getTime() - a.publishedTime.getTime()
        )
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
