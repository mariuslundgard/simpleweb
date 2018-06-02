// @flow @jsx h

import { Component, h } from 'preact'
import { connect } from 'preact-redux'

// Import actions
import { load } from '../../store/actions/home'
import { subscribe, unsubscribe, send } from '../../store/actions/eventSource'

// Import types
import type { GlobalState, HomeState } from '../../store/types'

type Props = HomeState & {
  load: () => void,
  sendToClient: (clientId: string, text: string) => void,
  subscribe: () => void,
  unsubscribe: () => void
}

class Home extends Component<Props> {
  static mapStateToProps = (state: GlobalState) => state.home

  static mapDispatchToProps = dispatch => ({
    load: () => dispatch(load()),
    sendToClient: (id: string, text: string) =>
      dispatch(send({ type: 'clients/SEND', id, text })),
    subscribe: () => dispatch(subscribe('home')),
    unsubscribe: () => dispatch(unsubscribe('home'))
  })

  static load = () => load()

  static isLoaded = (state: GlobalState) => !state.home.isLoading

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
    const { errors } = this.props
    const { clients } = this.props.data

    if (errors) {
      return <pre>{JSON.stringify(errors, null, 2)}</pre>
    }

    return (
      <div class='ml-admin-home'>
        {/* <h1>Admin</h1> */}

        {clients && clients.length === 0 && <div>No connected clients</div>}

        {clients &&
          clients.length > 0 && (
          <div>
            <h2>Clients</h2>
            <div>
              {clients.map(client => {
                return (
                  <div key={client.id}>
                    <h3>{client.ip}</h3>
                    <div>{client.id}</div>
                    <div>{client.channel}</div>
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
      </div>
    )
  }
}

export default connect(
  Home.mapStateToProps,
  Home.mapDispatchToProps
)(Home)
