// @flow

import gapi from '../lib/gapi'
import gdocAml from '../lib/gdoc-aml'

import type { Config } from '../../types'

function sanitizeId (str) {
  return str
    .toLowerCase()
    .replace(/[,.!]/g, '')
    .replace(/\s/g, '-')
}

async function fetchPost ({ childResource, token }) {
  const file = await gapi.drive.files.get({
    fileId: childResource.id,
    token,
    fields: ['name', 'kind', 'modifiedTime']
  })

  // console.log(file)

  const content = await gapi.drive.files.export({
    fileId: childResource.id,
    token,
    mimeType: 'text/html'
  })

  const doc = await gdocAml.parse(content)

  return {
    ...doc,
    type: doc.type || 'article',
    fileId: childResource.id,
    id: sanitizeId(doc.id || file.name),
    // id: childResource.id,
    name: file.name,
    publishedTime: doc.publishedTime
      ? new Date(Date.parse(doc.publishedTime))
      : null,
    modifiedTime: file.modifiedTime,
    keywords: doc.keywords
      ? doc.keywords.split(',').map(keyword => keyword.trim())
      : []
  }
}

async function fetchPosts (config: Config) {
  const { cache } = config
  const { credentials, rootFolderId } = config.google

  if (!rootFolderId) {
    throw new Error('Missing root folder ID')
  }

  const token = await gapi.oauth2.token({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive']
  })

  const childrenResource = await gapi.drive.files.list({
    parentId: rootFolderId,
    token,
    fields: ['id']
  })

  if (!childrenResource.files) {
    console.log('[worker] No files found in Google Drive')
    return
  }

  const posts = await Promise.all(
    childrenResource.files.map(childResource =>
      fetchPost({ childResource, token })
    )
  )

  const publishedPosts = posts.filter(post => post.publishedTime)

  await Promise.all(
    publishedPosts.map(post => cache.sadd('post_ids', post.fileId))
  )

  await cache.set('posts', JSON.stringify(publishedPosts))

  console.log(
    `[worker] Fetched ${posts.length} posts (${
      publishedPosts.length
    } published)`
  )
}

export default fetchPosts
