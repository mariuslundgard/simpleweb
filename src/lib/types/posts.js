// @flow

export type Article = {
  type: 'article',
  id: string,
  name: string,
  title: string,
  description: string,
  publishedTime: number,
  modifiedTime: number | null,
  image: { id: string } | null,
  keywords: string[],
  content: any
}

export type Project = {
  type: 'project',
  id: string,
  name: string,
  title: string,
  description: string,
  publishedTime: number,
  modifiedTime: number | null,
  image: { id: string } | null,
  keywords: string[],
  content: any
}

export type Post = Article | Project
