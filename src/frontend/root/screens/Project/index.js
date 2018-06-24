// @flow @jsx h

import { Component, h } from 'preact'
import { connect } from 'preact-redux'
import { Root } from '../../app'
import ContentItem from '../../lib/components/ContentItem'
import { formatDate } from '../../lib/date'
import Nav from '../../lib/components/Nav'
import { loadPost } from '../../store/actions'

import Image from './Image'

import type { ArticleMeta } from 'types/meta'
import type { GlobalState, PostState } from '../../store/types'

type Props = PostState

class Project extends Component<Props> {
  static criticalStyles = [
    Root.criticalStyles,
    Nav.criticalStyles,
    `.ml-project__image { max-width: 540px; margin: 0 auto; box-sizing: border-box }`,
    `.ml-project__image img { width: 100%; height: auto; vertical-align: top }`,
    `@media screen and (min-width: 900px) { .ml-project__image { max-width: 675px } }`,
    `.ml-project__header-content { padding: 0 15px 0 }`
  ].join('')

  static mapStateToProps = ({ post }: GlobalState) => post

  static load = params => loadPost(params.id)

  static isLoading = ({ post }: GlobalState) => post.isLoading

  static meta = (state: GlobalState): ArticleMeta => {
    if (!state.post.data) {
      const err: any = new Error('Not found')
      err.status = 404
      throw err
    }

    const { post } = state.post.data

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

  render () {
    const { baseUrl, onLinkClick } = this.context
    const { data, errors, isLoading } = this.props

    if (errors) {
      return <pre>{JSON.stringify(errors)}</pre>
    }

    if (isLoading) {
      return <article>Loading...</article>
    }

    const post = data && data.post

    if (!post) {
      return <article>No data</article>
    }

    return (
      <article class='ml-project'>
        <header class='ml-project__header'>
          {post.image && <Image {...post.image} />}
          <div class='ml-project__header-content'>
            <h1
              class='ml-project__title'
              dangerouslySetInnerHTML={{ __html: post.title || post.name }}
            />
            {post.keywords.length > 0 && (
              <div class='ml-project__keywords'>
                <span>Keywords</span>{' '}
                {post.keywords.length > 0 && (
                  <span>
                    {post.keywords.map(keyword => (
                      <span>
                        <a
                          key={keyword}
                          href={`${baseUrl}/?keyword=${keyword}`}
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
            <div class='ml-project__dateline'>
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
        <div class='ml-project__content'>
          {post.content &&
            post.content.map((item, idx) => (
              <ContentItem key={String(idx)} item={item} />
            ))}
        </div>
      </article>
    )
  }
}

export default connect(Project.mapStateToProps)(Project)
