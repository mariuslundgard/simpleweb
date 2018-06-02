// @flow @jsx h

import { Component, h } from 'preact'

type Props = {
  path: string
}

class Header extends Component<Props> {
  render () {
    const { path } = this.props
    const { onLinkClick } = this.context

    return (
      <nav class='ml-admin-nav'>
        <ul>
          <li>
            <a
              class={`ml-admin-nav__item${
                path === '/admin/' ? ' ml-admin-nav__item--active' : ''
              }`}
              href='/admin/'
              onClick={onLinkClick}
            >
              Home
            </a>
          </li>
          <li>
            <a
              class={`ml-admin-nav__item${
                path === '/admin/tasks' ? ' ml-admin-nav__item--active' : ''
              }`}
              href='/admin/tasks'
              onClick={onLinkClick}
            >
              Tasks
            </a>
          </li>
          <li>
            <a
              class={`ml-admin-nav__item${
                path === '/admin/features' ? ' ml-admin-nav__item--active' : ''
              }`}
              href='/admin/features'
              onClick={onLinkClick}
            >
              Features
            </a>
          </li>
        </ul>
      </nav>
    )
  }
}

export default Header
