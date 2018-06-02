'use strict'

const request = require('request')

const postMessage = msg =>
  new Promise((resolve, reject) => {
    request.post(
      {
        url: 'https://mariuslundgard.com/notifications',
        // url: 'http://localhost:3000/api/notifications',
        headers: msg
      },
      (err, res, body) => {
        if (err) {
          reject(err)
        } else {
          resolve(body)
        }
      }
    )
  })

async function simulateGoogleMessage () {
  // sync
  console.log(
    await postMessage({
      'x-goog-channel-id': 'simulate',
      'x-goog-channel-expiration': 'Sat, 02 Jun 2018 15:21:12 GMT',
      'x-goog-resource-state': 'sync',
      'x-goog-message-number': '1',
      'x-goog-resource-id': 'rQFMR4-2naJprJty4YRAIBVFnT4',
      'x-goog-resource-uri':
        'https://www.googleapis.com/drive/v3/changes?includeCorpusRemovals=false&includeRemoved=true&includeTeamDriveItems=false&pageSize=100&pageToken=112&restrictToMyDrive=false&spaces=drive&supportsTeamDrives=false&alt=json'
    })
  )

  // change
  console.log(
    await postMessage({
      'x-goog-channel-id': 'simulate',
      'x-goog-channel-expiration': 'Sat, 02 Jun 2018 15:21:12 GMT',
      'x-goog-resource-state': 'change',
      'x-goog-message-number': '685725',
      'x-goog-resource-id': 'rQFMR4-2naJprJty4YRAIBVFnT4',
      'x-goog-resource-uri':
        'https://www.googleapis.com/drive/v3/changes?includeCorpusRemovals=false&includeRemoved=true&includeTeamDriveItems=false&pageSize=100&pageToken=112&restrictToMyDrive=false&spaces=drive&supportsTeamDrives=false&alt=json'
    })
  )

  // change
  console.log(
    await postMessage({
      'x-goog-channel-id': 'simulate',
      'x-goog-channel-expiration': 'Sat, 02 Jun 2018 15:21:12 GMT',
      'x-goog-resource-state': 'change',
      'x-goog-message-number': '372092',
      'x-goog-resource-id': 'rQFMR4-2naJprJty4YRAIBVFnT4',
      'x-goog-resource-uri':
        'https://www.googleapis.com/drive/v3/changes?includeCorpusRemovals=false&includeRemoved=true&includeTeamDriveItems=false&pageSize=100&pageToken=112&restrictToMyDrive=false&spaces=drive&supportsTeamDrives=false&alt=json'
    })
  )

  // change
  console.log(
    await postMessage({
      'x-goog-channel-id': 'simulate',
      'x-goog-channel-expiration': 'Sat, 02 Jun 2018 15:21:12 GMT',
      'x-goog-resource-state': 'change',
      'x-goog-message-number': '745229',
      'x-goog-resource-id': 'rQFMR4-2naJprJty4YRAIBVFnT4',
      'x-goog-resource-uri':
        'https://www.googleapis.com/drive/v3/changes?includeCorpusRemovals=false&includeRemoved=true&includeTeamDriveItems=false&pageSize=100&pageToken=112&restrictToMyDrive=false&spaces=drive&supportsTeamDrives=false&alt=json'
    })
  )

  // // change
  // console.log(
  //   await postMessage({
  //     'x-goog-channel-id': 'simulate',
  //     'x-goog-channel-expiration': 'Sat, 02 Jun 2018 14:40:08 GMT',
  //     'x-goog-resource-state': 'change',
  //     'x-goog-message-number': '2561928',
  //     'x-goog-resource-id': 'rQFMR4-2naJprJty4YRAIBVFnT4',
  //     'x-goog-resource-uri':
  //       'https://www.googleapis.com/drive/v3/changes?includeCorpusRemovals=false&includeRemoved=true&includeTeamDriveItems=false&pageSize=100&pageToken=111&restrictToMyDrive=false&spaces=drive&supportsTeamDrives=false&alt=json'
  //   })
  // )
}

simulateGoogleMessage()
  .then(() => console.log('done simulating'))
  .catch(err => console.error(err))
