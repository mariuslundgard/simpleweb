'use strict'

const pino = require('pino')

const { BASE_URL, GOOGLE_ROOT_FOLDER_ID, REDIS_URL } = process.env
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  admin: {
    user: process.env.ADMIN_USER || 'admin',
    pass: process.env.ADMIN_PASS || 'admin'
  },
  baseUrl: BASE_URL,
  graphiql: !isProd,
  google: {
    channelExpiration: isProd ? 60 * 60 * 24 : 60, // seconds
    credentials: require('../secrets/google-service-account.json'),
    rootFolderId: GOOGLE_ROOT_FOLDER_ID
  },
  manifest: {
    'admin.css': 'admin.css',
    'admin.js': isProd ? 'admin.js' : 'admin-dev.js',
    'app.css': 'app.css',
    'app.js': isProd ? 'app.js' : 'app-dev.js',
    'maintenance.css': 'maintenance.css'
  },
  logger: pino({ name: 'main', prettyPrint: !isProd }),
  redis: {
    url: REDIS_URL
  }
}
