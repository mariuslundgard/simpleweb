// @flow @jsx h

import { Component, h } from 'preact'

class Nav extends Component<any> {
  static criticalStyles = [
    `.ml-nav { max-width: 540px; margin: 0 auto; padding: 0; list-style-type: none }`,
    `.ml-nav li { display: inline-block }`,
    `.ml-nav a { display: block; text-decoration: none; padding: 15px; opacity: 0.5; transition: opacity 200ms; will-change: opacity; }`,
    `.ml-nav:hover { opacity: 1 }`,
    `@media screen and (min-width: 900px) { .ml-nav { max-width: 675px; } }`
  ].join('')

  render () {
    const { baseUrl } = this.context
    const { onLinkClick } = this.context

    return (
      <ul class='ml-nav'>
        <li>
          <a href={`${baseUrl}/`} onClick={onLinkClick}>
            Marius Lundgård
          </a>
        </li>
      </ul>
    )
  }
}

export default Nav
