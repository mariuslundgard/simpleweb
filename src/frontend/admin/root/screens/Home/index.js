// @flow @jsx h

import { Component, h } from 'preact'
import { connect } from 'preact-redux'
import {
  loadHome,
  subscribeEventSource,
  sendEventSource
} from '../../store/actions'

import FeaturesList from './FeaturesList'
import TaskList from './TaskList'

import type { HomeState } from '../../store/types'

type Props = HomeState & {
  load: () => void,
  sendToClient: (clientId: string, text: string) => void,
  subscribe: () => void,
  toggleFeature: (key: string) => void,
  triggerTask: (key: string) => void
}

class Home extends Component<Props> {
  static mapStateToProps (state) {
    return state.home
  }

  static mapDispatchToProps (dispatch) {
    return {
      load: () => dispatch(loadHome()),
      sendToClient: (id: string, text: string) =>
        dispatch(sendEventSource({ type: 'clients/SEND', id, text })),
      subscribe: () => dispatch(subscribeEventSource('home')),
      toggleFeature: (key: string) =>
        dispatch(sendEventSource({ type: 'features/TOGGLE', key })),
      triggerTask: (key: string) =>
        dispatch(sendEventSource({ type: 'tasks/TRIGGER', key }))
    }
  }

  static load = () => loadHome()

  static isLoaded = state => !state.home.isLoading

  componentDidMount () {
    if (!this.props.isLoaded) {
      this.props.load()
    }

    this.props.subscribe()
  }

  render () {
    const { errors, toggleFeature, triggerTask } = this.props
    const { clients, features, tasks } = this.props.data

    if (errors) {
      return <pre>{JSON.stringify(errors, null, 2)}</pre>
    }

    return (
      <div class='ml-home'>
        <h1>Admin</h1>

        {clients && (
          <div>
            <h2>Clients</h2>
            <div>
              {clients.map(client => {
                return (
                  <div key={client.id}>
                    <h3>{client.ip}</h3>
                    <div>
                      <button
                        onClick={() =>
                          this.props.sendToClient(client.id, 'heartbeat')
                        }
                      >
                        Send heartbeat
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {features && (
          <FeaturesList features={features} onToggle={toggleFeature} />
        )}

        {tasks && <TaskList tasks={tasks} onTriggerTask={triggerTask} />}
      </div>
    )
  }
}

export default connect(
  Home.mapStateToProps,
  Home.mapDispatchToProps
)(Home)
