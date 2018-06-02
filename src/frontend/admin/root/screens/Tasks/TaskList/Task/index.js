// @flow @jsx h

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { Component, h } from 'preact'

import type { Task as TaskType } from 'types'

type Props = {
  task: TaskType
}

type State = {
  open: boolean
}

class Task extends Component<Props, State> {
  state = {
    open: false
  }

  handleClick = () => {
    this.setState({ open: !this.state.open })
  }

  render () {
    const { task } = this.props
    const { open } = this.state

    let summary
    let content

    switch (task.status) {
      case 'queued':
        summary = [
          <div class='ml-task__type'>{task.type}</div>,
          <div class='ml-task__time'>
            Queued {distanceInWordsToNow(task.created)} ago
          </div>
        ]
        content = task.payload && [
          <pre class='ml-task__payload'>
            {JSON.stringify(task.payload, null, 2)}
          </pre>
        ]
        break
      case 'started':
        summary = [
          <div class='ml-task__type'>{task.type}</div>,
          <div class='ml-task__time'>
            Started {`${distanceInWordsToNow(task.started)} ago`}
          </div>
        ]
        content = task.payload && [
          <pre class='ml-task__payload'>
            {JSON.stringify(task.payload, null, 2)}
          </pre>
        ]
        break
      case 'completed':
        summary = [
          <div class='ml-task__type'>{task.type}</div>,
          <div class='ml-task__time'>
            Completed {`${distanceInWordsToNow(task.completed)} ago`} in{' '}
            {((task.completed - task.started) / 1000).toFixed(1)} seconds
          </div>
        ]
        content = task.payload && [
          <pre class='ml-task__payload'>
            {JSON.stringify(task.payload, null, 2)}
          </pre>
        ]
        break
      case 'failed':
        summary = [
          <div class='ml-task__type'>{task.type}</div>,
          <div class='ml-task__time'>
            Failed {`${distanceInWordsToNow(task.failed)} ago`} in{' '}
            {((task.failed - task.started) / 1000).toFixed(1)} seconds
          </div>
        ]
        content = [
          task.payload && (
            <pre class='ml-task__payload'>
              {JSON.stringify(task.payload, null, 2)}
            </pre>
          ),
          task.error && <pre class='ml-task__error'>{task.error.message}</pre>
        ].filter(Boolean)
        break
      default:
        summary = [<div>Fetch post - Unknown status: {task.status}</div>]
        break
    }

    return (
      <div
        class={`ml-task ml-task--fetch-post ml-task--${task.status} ${
          open ? 'ml-task--open' : ''
        }`}
      >
        <div
          class='ml-task__summary'
          children={summary}
          onClick={this.handleClick}
        />
        {content && <div class='ml-task__content' children={content} />}
      </div>
    )
  }
}

export default Task
