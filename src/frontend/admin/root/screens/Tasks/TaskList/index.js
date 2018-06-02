// @flow @jsx h

import { Component, h } from 'preact'

import Task from './Task'

import type { Task as TaskType } from 'types'

type Props = {
  tasks: TaskType[],
  onTriggerTask: (key: string) => void
}

function TriggerButton ({
  name,
  onTriggerTask
}: {
  name: string,
  onTriggerTask: (key: string) => void
}) {
  return (
    <button onClick={() => onTriggerTask(name)}>
      Trigger <code>{name}</code>
    </button>
  )
}

class TaskList extends Component<Props> {
  render () {
    const { tasks, onTriggerTask } = this.props

    return (
      <div class='ml-admin-task-list'>
        <div class='ml-admin-task-list__btns'>
          <TriggerButton name='flushall' onTriggerTask={onTriggerTask} />
          <TriggerButton name='sync' onTriggerTask={onTriggerTask} />
          <TriggerButton name='subscribe' onTriggerTask={onTriggerTask} />
          <TriggerButton name='unsubscribe' onTriggerTask={onTriggerTask} />
        </div>
        <div>{tasks.map(task => <Task key={task.id} task={task} />)}</div>
      </div>
    )
  }
}

export default TaskList
