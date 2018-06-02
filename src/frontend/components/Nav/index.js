// @flow @jsx h

import { Component, h } from 'preact'

class Nav extends Component<any> {
  render () {
    const { onLinkClick } = this.context

    return (
      <div class='web-nav'>
        <div>
          <a href='/' onClick={onLinkClick}>
            Home
          </a>
        </div>
        <div>
          <a href='/blog' onClick={onLinkClick}>
            Blog
          </a>
        </div>
      </div>
    )
  }
}

export default Nav
