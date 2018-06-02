// @flow @jsx h

import { Component, h } from 'preact'

import type { WebsiteMeta } from '../types'

class NotFound extends Component<any> {
  static meta (data: any, params: any, query: any): WebsiteMeta {
    return {
      status: 404,
      robots: 'noindex,nofollow',
      locale: 'en_US',
      type: 'website',
      title: 'Page not found',
      url: '/'
    }
  }

  render () {
    return (
      <div class='ml-not-found-screen'>
        <h1>Page not found</h1>
      </div>
    )
  }
}

export default NotFound
