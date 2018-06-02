import 'preact/devtools/index'
import './app'

const eventSource = new EventSource('/dev')

eventSource.addEventListener('message', evt => {
  const msg = JSON.parse(evt.data)

  switch (msg.code) {
    case 'BUNDLE_END':
      if (msg.input.endsWith('/src/frontend/entries/app-dev.js')) {
        window.location.reload()
      }
      break
  }
})
