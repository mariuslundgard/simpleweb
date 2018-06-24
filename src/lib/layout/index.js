// @flow

import type { Meta } from 'types'

type Data = {
  criticalStyles?: string,
  baseUrl: string,
  meta: Meta,
  head?: string,
  body: string,
  robots?: string
}

function renderOpenGraphArticle (data: Data) {
  const { meta } = data

  if (meta.type === 'article') {
    const publishedTime = new Date(meta.publishedTime)
    const modifiedTime = meta.modifiedTime && new Date(meta.modifiedTime)
    return [
      `<meta property="article:published_time" content="${publishedTime.toUTCString()}" />`,
      modifiedTime &&
        `<meta property="article:modified_time" content="${modifiedTime.toUTCString()}" />`
    ]
      .filter(Boolean)
      .join('')
  }
}

function renderOpenGraph (data: Data) {
  const { baseUrl, meta } = data

  return [
    '<meta property="og:site_name" content="Marius Lundgård" />',
    meta.locale &&
      `<meta property="og:locale" content="${meta.locale.replace('-', '_')}">`,
    meta.type && `<meta property="og:type" content="${meta.type}">`,
    meta.title && `<meta property="og:title" content="${meta.title}">`,
    meta.description &&
      `<meta property="og:description" content="${meta.description}">`,
    meta.url && `<meta property="og:url" content="${baseUrl}${meta.url}">`,
    meta.image &&
      `<meta property="og:image" content="${baseUrl}${meta.image}">`,
    renderOpenGraphArticle(data)
  ]
    .filter(Boolean)
    .join('')
}

function renderTwitterCard (data: Data) {
  // TODO: Twitter Card
  return ''
}

function renderAuthor (data: Data) {
  const { meta } = data

  if (meta.type === 'article') {
    return [
      meta.author && meta.author.length > 0
        ? `<link rel="author" href="${meta.author[0].url}">`
        : '',
      meta.author && meta.author.length > 0
        ? `<link rel="publisher" href="${meta.author[0].url}">`
        : ''
    ].join('')
  }
}

function layout (data: Data) {
  const { baseUrl, meta } = data

  return [
    '<!DOCTYPE html>',
    `<html class="no-js no-online no-standalone" lang="${meta.locale.replace(
      '_',
      '-'
    )}">`,
    // TODO: opengraph prefix
    // '<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# http://ogp.me/ns/article#">',
    '<head>',
    '<meta charset="utf-8">',
    meta.description &&
      `<meta name="description" content="${meta.description}">`,
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta name="msapplication-tap-highlight" content="no" />',
    '<meta http-equiv="X-UA-Compatible" content="IE=edge" />',
    `<title>${
      meta.title !== 'Marius Lundgård'
        ? `${meta.title} | Marius Lundgård`
        : 'Marius Lundgård'
    }</title>`,
    // TODO
    '<link rel="Copyright" title="Copyright Marius Lundgård" href="https://mariuslundgard.com/license" />',
    `<link rel="canonical" href="${baseUrl}${meta.url}">`,
    renderAuthor(data),
    renderOpenGraph(data),
    renderTwitterCard(data),
    meta.robots && `<meta name="robots" content="${meta.robots}" />`,
    meta.robots && `<meta name="googlebot" content="${meta.robots}" />`,
    // renderFonts(),
    data.criticalStyles ? `<style>${data.criticalStyles.trim()}</style>` : null,
    data.head,
    '</head>',
    '<body>',
    data.body,
    '</body>',
    '</html>'
  ]
    .filter(Boolean)
    .join('')
}

export default layout
