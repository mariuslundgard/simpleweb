// @flow @jsx h

import { Component, h } from 'preact'
import { connect } from 'preact-redux'

import type { WebsiteMeta } from 'types/meta'
import type { GlobalState } from '../../store/types'

type Props = {
  error: {
    message: string,
    stack?: string
  }
}

class ErrorScreen extends Component<Props> {
  static mapStateToProps = (state: GlobalState) => ({
    error: state.route.error
  })

  static meta (state: GlobalState): WebsiteMeta {
    return {
      status: 500,
      robots: 'noindex,nofollow',
      locale: 'en_US',
      type: 'website',
      title: `Error: ${(state.route.error && state.route.error.message) ||
        'Unkwown'}`,
      url: '/'
    }
  }

  render () {
    const { error } = this.props

    return (
      <div class='ml-error-screen'>
        <h1 class='ml-error-screen__message'>{error.message}</h1>
        {error.stack && <pre class='ml-error-screen__stack'>{error.stack}</pre>}
        <div class='ml-error-screen__button-wrapper'>
          <a href='/'>Start over</a>
        </div>
      </div>
    )
  }
}

export default connect(ErrorScreen.mapStateToProps)(ErrorScreen)
