// @flow

import gapi from './gapi'
import gdocAml from './gdoc-aml'

import type { Config } from '../../../types'

export function sanitizeId (str: string) {
  return str
    .toLowerCase()
    .replace(/[‘’]/g, '-')
    .replace(/[,.!]/g, '')
    .replace(/\s/g, '-')
}

export async function fetchToken (config: Config) {
  const rawToken = await config.cache.get('token')

  if (rawToken) {
    return JSON.parse(rawToken)
  }

  const token = await gapi.oauth2.token({
    credentials: config.google.credentials,
    scopes: ['https://www.googleapis.com/auth/drive']
  })

  await config.cache.set('token', JSON.stringify(token))
  await config.cache.expire('token', token.expires_in - 60)

  return token
}

export async function fetchPost (config: Config, fileId: string) {
  const token = await fetchToken(config)

  const file = await gapi.drive.files.get({
    fileId,
    token,
    fields: ['name', 'kind', 'mimeType', 'modifiedTime', 'trashed', 'parents']
  })

  if (file.mimeType !== 'application/vnd.google-apps.document') {
    return null
  }

  const content = await gapi.drive.files.export({
    fileId: fileId,
    token,
    mimeType: 'text/html'
  })

  const doc = await gdocAml.parse(content)

  // console.log(doc.image)

  let image
  if (doc.image && doc.image.id && doc.image.alt) {
    image = {
      id: doc.image.id,
      alt: doc.image.alt
    }
  }

  return {
    ...doc,
    image,
    type: doc.type || 'article',
    mimeType: file.mimeType,
    fileId,
    id: sanitizeId(doc.id || file.name),
    name: file.name,
    description: doc.description,
    trashed: file.trashed,
    publishedTime: doc.publishedTime ? Date.parse(doc.publishedTime) : null,
    modifiedTime: file.modifiedTime ? Date.parse(file.modifiedTime) : null,
    keywords: doc.keywords
      ? doc.keywords.split(',').map(keyword => keyword.trim())
      : []
  }
}

export async function removeFile (config: Config, id: string) {
  const { cache, logger } = config

  await cache.srem('post_ids', id)
  await cache.del(`posts:${id}`)

  logger.info(`Post #${id} was removed`)
}

export async function updateFile (config: Config, id: string) {
  const { logger } = config

  const post = await fetchPost(config, id)

  if (!post) {
    return null
  }

  await config.cache.set(`posts:${id}`, JSON.stringify(post))

  logger.info(`Post #${id} was updated`)
}

export async function addFile (config: Config, id: string) {
  const { logger } = config
  const post = await fetchPost(config, id)

  if (!post) {
    return null
  }

  await config.cache.sadd('post_ids', id)
  await config.cache.set(`posts:${id}`, JSON.stringify(post))

  logger.info(`Post #${id} was added`)
}
