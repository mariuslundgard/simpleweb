// @flow @jsx h

import { Component, h } from 'preact'
import { connect } from 'preact-redux'
import screens from '../screens'

import Header from '../lib/components/Header'

import type { GlobalState, RouteState } from '../store/types'

type Props = RouteState & {
  onLinkClick: (path: string, query: any) => void
}

type State = {}

class Root extends Component<Props, State> {
  static mapStateToProps = (state: GlobalState) => state.route

  getChildContext () {
    return {
      onLinkClick: this.props.onLinkClick
    }
  }

  render () {
    const { path, name } = this.props
    const Screen = screens[name]

    if (Screen) {
      return (
        <div class='ml-app'>
          <Header path={`${path}`} />
          <Screen />
        </div>
      )
    }

    return <div class='ml-app ml-app--not-found'>Page not found</div>
  }
}

export default connect(Root.mapStateToProps)(Root)
