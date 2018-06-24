// @flow @jsx h

import { Component, h } from 'preact'
import { connect } from 'preact-redux'

// Import components
import Footer from '../lib/components/Footer'
import Nav from '../lib/components/Nav'

import type { GlobalState, RouteState } from '../store/types'

type Props = {
  baseUrl: string,
  route: RouteState,
  screens: any,
  mode: 'browser' | 'server',
  onLinkClick: (path: string, query: any) => void
}

class Root extends Component<Props> {
  screen: any

  static criticalStyles = [
    `a { color: inherit }`,
    `body { font: 16px/1.5 -apple-system, BlinkMacSystemFont, sans-serif; margin: 0 }`,
    `.ml-app--is-server { color: #999 }`,
    `.ml-app--is-loading-screen { color: #999 }`
  ].join('')

  static mapStateToProps = (state: GlobalState) => ({
    route: state.route
  })

  getChildContext () {
    return {
      mode: this.props.mode,
      baseUrl: this.props.baseUrl,
      onLinkClick: this.props.onLinkClick
    }
  }

  render () {
    const { mode, route, screens } = this.props
    const { isLoadingScreen } = route
    const Screen = screens[route.name] || screens.notFound
    const className = `ml-app ml-app--is-${mode}${
      isLoadingScreen ? ' ml-app--is-loading-screen' : ''
    }`

    return (
      <div class={className}>
        <Nav />
        <Screen />
        <Footer />
      </div>
    )
  }
}

export default connect(Root.mapStateToProps)(Root)
