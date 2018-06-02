// @flow @jsx h

import { Component, h } from 'preact'
import ContentItem from '../components/ContentItem'

import type { ArticleMeta } from '../types'

type Params = {
  id: string
}

type ContentItemData = any

type Data = {
  post: {
    type: 'project',
    id: string,
    name: string,
    title?: string,
    publishedTime: number,
    modifiedTime?: number,
    keywords: string[],
    content: ContentItemData[]
  }
}

type Error = {
  message: string
}

type Props = {
  data?: Data,
  errors?: Error[]
}

class Project extends Component<Props> {
  static meta (data: Data, params: Params, query: any): ArticleMeta {
    const { post } = data

    return {
      locale: 'en_US',
      type: 'article',
      title: post.title || post.name,
      url: `/${post.type}/${post.id}`,
      publishedTime: post.publishedTime,
      modifiedTime: post.modifiedTime,
      author: [
        {
          firstName: 'Marius',
          lastName: 'Lundgård',
          username: 'mariuslundgard',
          gender: 'male',
          url: 'https://mariuslundgard.com'
        }
      ]
    }
  }

  static query (params: Params, query: any) {
    return `{
      post(id: "${params.id}") {
        id
        name
        title
        content
        publishedTime
        modifiedTime
        keywords
      }
    }`
  }

  render () {
    const { onLinkClick } = this.context
    const { data, errors } = this.props

    if (errors) {
      return <pre>{JSON.stringify(errors)}</pre>
    }

    if (!data) {
      return <div>Loading...</div>
    }

    return (
      <article>
        <h1>{data.post.title || data.post.name}</h1>
        <div>{data.post.publishedTime}</div>
        <ul>
          {data.post.keywords.map(keyword => (
            <li>
              <a
                key={keyword}
                href={`/?keyword=${keyword}`}
                onClick={onLinkClick}
              >
                {keyword}
              </a>
            </li>
          ))}
        </ul>
        <div>
          {data.post.content.map((item, idx) => (
            <ContentItem key={String(idx)} item={item} />
          ))}
        </div>
      </article>
    )
  }
}

export default Project
