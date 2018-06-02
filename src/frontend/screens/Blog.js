// @flow @jsx h

import { Component, h } from 'preact'

import type { WebsiteMeta } from '../types'

class Blog extends Component<any> {
  static meta (data: any, params: any, query: any): WebsiteMeta {
    return {
      locale: 'en_US',
      type: 'website',
      title: 'Blog',
      description: 'The writings of a designer/developer.',
      url: '/blog'
    }
  }

  render () {
    const { baseUrl } = this.context

    return <div>Blog ({baseUrl})</div>
  }
}

export default Blog
