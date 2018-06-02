// @flow @jsx h

import { format } from 'date-fns'
import { Component, h } from 'preact'

import type { WebsiteMeta } from '../types'

type Post = {
  type: 'article' | 'project',
  id: string,
  name: string,
  publishedTime: string
}

type Article = {
  type: 'article',
  id: string,
  name: string,
  publishedTime: string
}

type Project = {
  type: 'project',
  id: string,
  name: string,
  publishedTime: string
}

type Data = {
  articles: Article[],
  projects: Project[],
  modifiedTime: string,
  posts: Post[]
}

type Props = {
  data?: Data,
  query: any
}

class Home extends Component<Props> {
  static meta (data: Data, params: any, query: any): WebsiteMeta {
    const keyword = query.keyword && query.keyword.toLowerCase()

    if (keyword) {
      return {
        locale: 'en_US',
        type: 'website',
        title: `Content tagged with “${keyword}”`,
        description: 'The website of a designer/developer.',
        url: '/'
      }
    }

    return {
      locale: 'en_US',
      type: 'website',
      title: 'Editorial Design Technology',
      description: 'The website of a designer/developer.',
      url: '/'
    }
  }

  static query (params: any, query: any) {
    if (query.keyword) {
      return `{
        articles: posts (keyword: "${query.keyword}", type: "article") {
          id
          type
          name
          publishedTime
        }
        projects: posts (keyword: "${query.keyword}", type: "project") {
          id
          type
          name
          publishedTime
        }
      }`
    }

    return `{
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
  }

  render () {
    const { onLinkClick } = this.context
    const { data, query } = this.props

    if (!data) {
      return <div class='ml-home ml-home--laster'>Laster...</div>
    }

    const articles = data.articles || []
    const projects = data.projects || []

    return (
      <div class='ml-home'>
        {articles.length > 0 && (
          <div>
            {query.keyword ? (
              <h2>Articles ({query.keyword})</h2>
            ) : (
              <h2>Articles</h2>
            )}
            <ol>
              {articles.map(post => (
                <li key={post.id}>
                  <a href={`/${post.type}/${post.id}`} onClick={onLinkClick}>
                    {post.name} ({format(post.publishedTime, 'MM.DD.YYYY')})
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}

        {projects.length > 0 && (
          <div>
            {query.keyword ? (
              <h2>Projects ({query.keyword})</h2>
            ) : (
              <h2>Projects</h2>
            )}
            <ol>
              {projects.map(post => (
                <li key={post.id}>
                  <a href={`/${post.type}/${post.id}`} onClick={onLinkClick}>
                    {post.name} ({post.publishedTime})
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    )
  }
}

export default Home
