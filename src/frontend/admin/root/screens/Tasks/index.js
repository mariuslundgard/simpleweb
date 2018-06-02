// @flow @jsx h

import { Component, h } from 'preact'
import { connect } from 'preact-redux'

// Import components
import TaskList from './TaskList'

// Import actions
import { subscribe, unsubscribe, send } from '../../store/actions/eventSource'
import { load } from '../../store/actions/tasks'

// Import types
import type { TasksState } from '../../store/types'

type Props = TasksState & {
  load: () => void,
  sendToClient: (clientId: string, text: string) => void,
  subscribe: () => void,
  unsubscribe: () => void,
  triggerTask: (key: string) => void
}

class Tasks extends Component<Props> {
  static mapStateToProps (state) {
    return state.tasks
  }

  static mapDispatchToProps (dispatch) {
    return {
      load: () => dispatch(load()),
      subscribe: () => dispatch(subscribe('tasks')),
      unsubscribe: () => dispatch(unsubscribe('tasks')),
      triggerTask: (key: string) =>
        dispatch(send({ type: 'tasks/TRIGGER', key }))
    }
  }

  static load = () => load()

  static isLoaded = state => !state.tasks.isLoading

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
    const { errors, triggerTask } = this.props
    const { tasks } = this.props.data

    if (errors) {
      return <pre>{JSON.stringify(errors, null, 2)}</pre>
    }

    return (
      <div class='ml-tasks'>
        <h1 style={{ display: 'none' }}>Tasks</h1>
        {tasks && <TaskList tasks={tasks} onTriggerTask={triggerTask} />}
      </div>
    )
  }
}

export default connect(
  Tasks.mapStateToProps,
  Tasks.mapDispatchToProps
)(Tasks)
