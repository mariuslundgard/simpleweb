// @flow

import qs from 'qs'
import gapi from '../lib/gapi'

async function googleNotification (config: any, task: any) {
  const { credentials } = config
  const { payload } = task

  // console.log('googleNotification', payload)

  const query = qs.parse(payload.resourceUri.split('?')[1])

  // console.log(query)

  const token = await gapi.oauth2.token({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive']
  })

  const changes = await gapi.drive.changes.list({
    ...query,
    token
  })

  changes.changes.forEach(change => {
    if (change.removed) {
      console.log('[worker] file removed!')
    } else {
      console.log('[worker] file changed!', change.file.name)
    }
    // console.log(change)
  })

  // res.send('changed')
}

export default googleNotification
