// @flow @jsx h

import { Component, h } from 'preact'

import type { WebsiteMeta } from '../../types'

class ErrorScreen extends Component<any> {
  static meta (data: any, params: any, query: any): WebsiteMeta {
    return {
      status: 500,
      robots: 'noindex,nofollow',
      locale: 'en_US',
      type: 'website',
      title: data.title,
      url: '/'
    }
  }

  render () {
    const { title, description } = this.props

    return (
      <div class='ml-error-screen'>
        <h1 class='ml-error-screen__title'>{title}</h1>
        <div class='ml-error-screen__description'>{description}</div>
        <div class='ml-error-screen__button-wrapper'>
          <a href='/'>Start over</a>
        </div>
      </div>
    )
  }
}

export default ErrorScreen
