// @flow @jsx h

import { format } from 'date-fns'
import { Component, h } from 'preact'
import ContentItem from '../components/ContentItem'

import type { ArticleMeta } from '../types'

type Params = {
  id: string
}

type Post = any

type Data = {
  post: Post
}

function formatDate (d: any) {
  const t = new Date()

  if (typeof d !== 'object') {
    d = new Date(d)
  }

  const dy = d.getFullYear()
  const ty = t.getFullYear()
  const dm = d.getMonth()
  const tm = t.getMonth()
  const dd = d.getDate()
  const td = t.getDate()

  if (dy === ty && dm === tm && dd === td) {
    return format(d, 'h:mm a')
  }

  if (dy === ty) {
    return format(d, 'MMMM D')
  }

  return format(d, 'MMMM D, YYYY h:mm a')
}

const BASE_URL = 'https://res.cloudinary.com/mariuslundgard/image/upload'
type ImageProps = { alt: string, id: string }
function Image (props: ImageProps) {
  const { alt, id } = props
  const srcs = {
    large2x: `${BASE_URL}/c_fill,h_726,w_1290/${id}.jpg`,
    large: `${BASE_URL}/c_fill,h_363,w_645/${id}.jpg`,
    medium2x: `${BASE_URL}/c_fill,h_574,w_1020/${id}.jpg`,
    medium: `${BASE_URL}/c_fill,h_287,w_510/${id}.jpg`,
    small2x: `${BASE_URL}/c_fill,h_422,w_750/${id}.jpg`,
    small: `${BASE_URL}/c_fill,h_211,w_375/${id}.jpg`
  }

  return (
    <div class='ml-article__image'>
      <img
        src={srcs.small}
        alt={alt}
        srcset={[
          `${srcs.large2x} 1290w`,
          `${srcs.large} 645w`,
          `${srcs.medium2x} 1020w`,
          `${srcs.medium} 510w`,
          `${srcs.small2x} 750w`,
          `${srcs.small} 375w`
        ].join(',')}
        sizes={[
          `(min-width: 900px) 645px`,
          `(min-width: 540px) 510px`,
          '100vw'
        ].join(',')}
      />
    </div>
  )
}

class Article extends Component<any> {
  static meta (data: Data, params: Params, query: any): ArticleMeta | null {
    const { post } = data

    if (!post) {
      return null
    }

    return {
      locale: 'en_US',
      type: 'article',
      title: post.title || post.name,
      description: post.description,
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
        type
        id
        name
        image {
          id
          alt
        }
        title
        description
        content
        modifiedTime
        publishedTime
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

    const post = data && data.post

    if (!post) {
      return null
    }

    return (
      <article class='ml-article'>
        <header class='ml-article__header'>
          {post.image && <Image {...post.image} />}
          <div class='ml-article__header-content'>
            <h1
              class='ml-article__title'
              dangerouslySetInnerHTML={{ __html: post.title || post.name }}
            />
            {post.keywords.length > 0 && (
              <div class='ml-article__keywords'>
                <span>Keywords</span>{' '}
                {post.keywords.length > 0 && (
                  <span>
                    {post.keywords.map(keyword => (
                      <span>
                        <a
                          key={keyword}
                          href={`/?keyword=${keyword}`}
                          onClick={onLinkClick}
                        >
                          {keyword}
                        </a>{' '}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            )}
            <div class='ml-article__dateline'>
              <div>
                <span>Published</span>{' '}
                <time>{formatDate(post.publishedTime)}</time>
              </div>
              {/* {post.modifiedTime && (
              <div>
                <span>Modified</span>{' '}
                <time>{formatDate(post.modifiedTime)}</time>
              </div>
            )} */}
            </div>
          </div>
        </header>
        <div class='ml-article__content'>
          {post.content &&
            post.content.map((item, idx) => (
              <ContentItem key={String(idx)} item={item} />
            ))}
        </div>
      </article>
    )
  }
}

export default Article
