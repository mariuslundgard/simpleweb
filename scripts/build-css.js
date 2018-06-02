'use strict'

const path = require('path')
const mkdirp = require('util').promisify(require('mkdirp'))
const postcss = require('./lib/postcss')
const buildConfig = require('../src/frontend/build.config')

mkdirp(path.resolve(__dirname, '../dist/client'))
  .then(() => {
    return Promise.all(
      buildConfig.css.map(cssConfig => postcss.bundle(cssConfig))
    )
  })
  .then(() => console.log('built css'))
