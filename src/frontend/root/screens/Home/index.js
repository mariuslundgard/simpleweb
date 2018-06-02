// @flow @jsx h

import { Component, h } from 'preact'
import { connect } from 'preact-redux'
import { formatDate } from '../../lib/date'

// Import actions
import { load } from '../../store/actions/home'
import { subscribe, unsubscribe } from '../../store/actions/eventSource'

// Import types
import type { Features } from 'types'
import type { WebsiteMeta } from 'types/meta'
import type { GlobalState, HomeState } from '../../store/types'

type Props = HomeState & {
  features: Features,
  keyword: string | null,
  subscribe: () => void,
  unsubscribe: () => void
}

/**
 * Home component (screen)
 * @extends Component
 */

class Home extends Component<Props> {
  static mapStateToProps = ({ features, home, route }: GlobalState) => ({
    ...home,
    features,
    keyword: (route.query.keyword && route.query.keyword.toLowerCase()) || null
  })

  static mapDispatchToProps = dispatch => ({
    subscribe: () => dispatch(subscribe('home')),
    unsubscribe: () => dispatch(unsubscribe('home'))
  })

  static isLoading = ({ home }: GlobalState) => home.isLoading

  static load = (params: any, query: any) => load(query.keyword)

  static meta (state: GlobalState): WebsiteMeta {
    const { query } = state.route
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

  componentDidMount () {
    this.props.subscribe()
  }

  componentWillUnmount () {
    this.props.unsubscribe()
  }

  render () {
    const { baseUrl, onLinkClick } = this.context
    const {
      messages,
      features,
      isLoading,
      data,
      error,
      errors,
      keyword
    } = this.props

    if (isLoading) {
      return <div class='ml-home ml-home--laster'>Laster...</div>
    }

    if (error) {
      return <div>Error: {error.message}</div>
    }

    if (errors) {
      return <div>Load errors: {JSON.stringify(errors)}</div>
    }

    if (!data) {
      throw new Error('No data')
    }

    const articles = data.articles || []
    const projects = data.projects || []

    return (
      <div class='ml-home'>
        {messages.map(message => <div>{message}</div>)}

        {articles.length === 0 &&
          projects.length === 0 && (
          <h1 class='ml-home__title'>Nothing to see (yet)</h1>
        )}

        {articles.length > 0 && (
          <div class='ml-home__entry-list'>
            {keyword ? <h2>Articles ({keyword})</h2> : <h2>Articles</h2>}
            <ol>
              {articles.map(post => (
                <li key={post.id}>
                  <a
                    href={`${baseUrl}/${post.type}/${post.id}`}
                    onClick={onLinkClick}
                  >
                    <div class='ml-home__entry-title'>{post.name}</div>
                    <div class='ml-home__entry-published'>
                      {formatDate(post.publishedTime)}
                    </div>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
        {features.projects &&
          projects.length > 0 && (
          <div class='ml-home__entry-list'>
            {keyword ? <h2>Projects ({keyword})</h2> : <h2>Projects</h2>}
            <ol>
              {projects.map(post => (
                <li key={post.id}>
                  <a
                    href={`${baseUrl}/${post.type}/${post.id}`}
                    onClick={onLinkClick}
                  >
                    <div class='ml-home__entry-title'>{post.name}</div>
                    <div class='ml-home__entry-published'>
                      {formatDate(post.publishedTime)}
                    </div>
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

export default connect(
  Home.mapStateToProps,
  Home.mapDispatchToProps
)(Home)
