// @flow @jsx h

import { Component, h } from 'preact'
import { connect } from 'preact-redux'
import { Root } from '../../app'
import ContentItem from '../../lib/components/ContentItem'
import { formatDate } from '../../lib/date'
import Nav from '../../lib/components/Nav'

// Import components
import Image from './Image'

// Import actions
import { load } from '../../store/actions/post'
import { subscribe, unsubscribe } from '../../store/actions/eventSource'

import type { ArticleMeta } from 'types/meta'
import type { GlobalState, PostState } from '../../store/types'

type Props = PostState & {
  subscribe: (id: string) => void,
  unsubscribe: (id: string) => void
}

class Article extends Component<Props> {
  static criticalStyles = [
    Root.criticalStyles,
    ContentItem.criticalStyles,
    Nav.criticalStyles,
    `.ml-article { padding: 0.5em 0 2em; min-height: calc(100vh - 100px); box-sizing: border-box }`,
    `.ml-article__image { max-width: 540px; margin: 0 auto; box-sizing: border-box }`,
    `.ml-article__image img { width: 100%; height: auto; vertical-align: top }`,
    `@media screen and (min-width: 900px) { .ml-article__image { max-width: 675px } }`,
    `.ml-article__header-content { padding: 0 15px 0; max-width: 540px; margin: 0 auto 1em; box-sizing: border-box }`,
    `@media screen and (min-width: 900px) { .ml-article__header-content { max-width: 675px } }`
  ].join('')

  static mapStateToProps = ({ post }: GlobalState) => post

  static mapDispatchToProps = dispatch => ({
    subscribe: (id: string) => dispatch(subscribe(`post/${id}`)),
    unsubscribe: (id: string) => dispatch(unsubscribe(`post/${id}`))
  })

  static load = params => load(params.id)

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

  componentDidMount () {
    const { data } = this.props

    if (data && data.post.id) {
      this.props.subscribe(data.post.id)
    }
  }

  componentDidUpdate (prevProps: Props) {
    const { data } = this.props

    if (prevProps.data === null && data) {
      // loaded post
      this.props.subscribe(data.post.id)
    } else if (
      prevProps.data &&
      data &&
      prevProps.data.post.id !== data.post.id
    ) {
      // change post
      this.props.unsubscribe(prevProps.data.post.id)
      this.props.subscribe(data.post.id)
    }
  }

  componentWillUnmount () {
    const { data } = this.props

    if (data && data.post.id) {
      this.props.unsubscribe(data.post.id)
    }
  }

  render () {
    const { baseUrl, onLinkClick } = this.context
    const { data, errors, isLoading } = this.props

    if (errors) {
      return <pre>{JSON.stringify(errors)}</pre>
    }

    if (isLoading) {
      return (
        <article class='ml-article ml-article--loading'>Loading...</article>
      )
    }

    const post = data && data.post

    if (!post) {
      return <article class='ml-article ml-article--no-data'>No data</article>
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

export default connect(
  Article.mapStateToProps,
  Article.mapDispatchToProps
)(Article)
