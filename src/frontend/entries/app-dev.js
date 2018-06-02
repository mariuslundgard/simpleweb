import 'preact/devtools/index'
import './app'

const eventSource = new EventSource('/dev')

eventSource.addEventListener('message', evt => {
  const msg = JSON.parse(evt.data)

  switch (msg.code) {
    case 'CSS_BUNDLE_END':
      window.location.reload()
      break

    case 'BUNDLE_END':
      if (
        typeof msg.input === 'string' &&
        msg.input.endsWith('/src/frontend/entries/app-dev.js')
      ) {
        window.location.reload()
      }
      break
  }
})
