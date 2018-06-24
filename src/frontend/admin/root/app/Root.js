// @flow @jsx h

import { Component, h } from 'preact'
import { connect } from 'preact-redux'
import screens from '../screens'

type Props = {
  name: string
}

type State = {}

class Router extends Component<Props, State> {
  static mapStateToProps = state => state.route

  render () {
    const { name } = this.props
    const Screen = screens[name]

    if (Screen) {
      return <Screen />
    }

    return <div>Page not found</div>
  }
}

export default connect(Router.mapStateToProps)(Router)
