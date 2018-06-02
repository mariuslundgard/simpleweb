// @flow

export type Author = {
  firstName: string,
  lastName: string,
  url: string
}

export type BaseMeta = {
  status?: number,
  robots?: string,
  locale: string,
  title: string,
  description?: string,
  url: string,
  image?: string
}

export type ArticleMeta = BaseMeta & {
  type: 'article',
  author?: Author[],
  publishedTime: number,
  modifiedTime?: number
}

export type WebsiteMeta = BaseMeta & {
  type: 'website'
}

export type Meta = ArticleMeta | WebsiteMeta
