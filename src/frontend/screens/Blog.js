// @flow @jsx h

import { Component, h } from 'preact'

class Blog extends Component<any> {
  render () {
    const { baseUrl } = this.context

    return <div>Blog ({baseUrl})</div>
  }
}

export default Blog
