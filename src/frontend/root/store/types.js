// @flow

import type { Features, Article, Project, Post } from 'types'

type HomeData = {
  articles: Article[],
  projects: Project[],
  modifiedTime: string
}

type PostData = {
  post: Post
}

type Error = {
  message: string,
  stack?: string
}

export type HomeState = {
  messages: string[],
  data: HomeData | null,
  errors: Error[] | null,
  isLoading: boolean,
  isLoaded: boolean,
  isFailed: boolean,
  error: Error | null
}

export type PostState = {
  data: PostData | null,
  errors: Error[] | null,
  isLoading: boolean,
  isLoaded: boolean,
  isFailed: boolean,
  error: Error | null
}

export type RouteState = {
  basePath: string,
  name: string | null,
  params: any,
  query: any,
  isLoadingScreen: boolean,
  error?: Error
}

export type GlobalState = {
  features: Features,
  home: HomeState,
  route: RouteState,
  post: PostState
}
