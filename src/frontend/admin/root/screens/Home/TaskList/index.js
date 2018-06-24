// @flow @jsx h

import { Component, h } from 'preact'

import Task from './Task'

import type { Task as TaskType } from 'types'

type Props = {
  tasks: TaskType[],
  onTriggerTask: (key: string) => void
}

class TaskList extends Component<Props> {
  render () {
    const { tasks, onTriggerTask } = this.props

    return (
      <div>
        <h2>Tasks</h2>

        <div>
          <button onClick={() => onTriggerTask('sync')}>
            Trigger <code>sync</code>
          </button>
          <button onClick={() => onTriggerTask('subscribe')}>
            Trigger <code>subscribe</code>
          </button>
          <button onClick={() => onTriggerTask('unsubscribe')}>
            Trigger <code>unsubscribe</code>
          </button>
        </div>

        <div>{tasks.map(task => <Task key={task.id} {...task} />)}</div>
      </div>
    )
  }
}

export default TaskList
