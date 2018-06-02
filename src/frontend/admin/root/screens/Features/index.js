// @flow @jsx h

import { Component, h } from 'preact'
import { connect } from 'preact-redux'

// Import components
import FeaturesList from './FeaturesList'

// Import actions
import { load } from '../../store/actions/features'
import { subscribe, unsubscribe, send } from '../../store/actions/eventSource'

// Import types
import type { FeaturesState } from '../../store/types'

type Props = FeaturesState & {
  load: () => void,
  subscribe: () => void,
  unsubscribe: () => void,
  toggle: (key: string) => void
}

class Features extends Component<Props> {
  static mapStateToProps (state) {
    return state.features
  }

  static mapDispatchToProps (dispatch) {
    return {
      load: () => dispatch(load()),
      subscribe: () => dispatch(subscribe('features')),
      unsubscribe: () => dispatch(unsubscribe('features')),
      toggle: (key: string) => dispatch(send({ type: 'features/TOGGLE', key }))
    }
  }

  static load = () => load()

  static isLoaded = state => !state.features.isLoading

  componentDidMount () {
    if (!this.props.isLoaded) {
      this.props.load()
    }

    this.props.subscribe()
  }

  componentWillUnmount () {
    this.props.unsubscribe()
  }

  render () {
    const { errors, toggle } = this.props
    const { features } = this.props.data

    if (errors) {
      return <pre>{JSON.stringify(errors, null, 2)}</pre>
    }

    return (
      <div class='ml-features'>
        {/* <h1>Features</h1> */}
        {features && <FeaturesList features={features} onToggle={toggle} />}
      </div>
    )
  }
}

export default connect(
  Features.mapStateToProps,
  Features.mapDispatchToProps
)(Features)
