// @flow @jsx h

import { Component, h } from 'preact'

class Nav extends Component<any> {
  render () {
    const { onLinkClick } = this.context

    return (
      <ul class='ml-nav'>
        <li>
          <a href='/' onClick={onLinkClick}>
            Marius Lundgård
          </a>
        </li>
        {/* <div>
          <a href='/blog' onClick={onLinkClick}>
            Blog
          </a>
        </div> */}
      </ul>
    )
  }
}

export default Nav
