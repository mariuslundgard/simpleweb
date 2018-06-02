// @flow

import handlers from './handlers'

export default { create }

function create (config: any) {
  const { consumer } = config.queue

  async function handleTask (task) {
    switch (task.type) {
      case 'googleNotification':
        return handlers.googleNotification(config.google, task)
      case 'fetchPosts':
        return handlers.fetchPosts(config)
      case 'subscribe':
        return handlers.subscribe(config)
      case 'unsubscribe':
        return handlers.unsubscribe(config)
      default:
        throw new Error(`Unknown task: ${task.type}`)
    }
  }

  function getNextTask () {
    consumer.blpop('tasks', 0).then(result => {
      if (result) {
        handleTask(JSON.parse(result[1]))
          .then(() => {
            getNextTask()
          })
          .catch(err => {
            console.log('error', err.stack)
            getNextTask()
          })
      } else {
        console.log('timeout')
        setTimeout(() => getNextTask(), 1000)
      }
    })
  }

  getNextTask()

  console.log('[worker] ready')
}
