// @flow @jsx h

import { Component, h } from 'preact'

import type { WebsiteMeta } from 'types/meta'

class Maintenance extends Component<any> {
  static meta (data: any, params: any, query: any): WebsiteMeta {
    return {
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
      <div class='ml-maintenance'>
        <h1 class='ml-maintenance__title'>{title}</h1>
        <div class='ml-maintenance__description'>{description}</div>
        {/* <div class='ml-maintenance__button-wrapper'>
          <a href='/'>Subscribe to newsletter</a>
        </div> */}
      </div>
    )
  }
}

export default Maintenance
