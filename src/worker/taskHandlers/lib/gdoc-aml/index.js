'use strict'

const archieml = require('archieml')
const { clean } = require('./clean')

exports.parse = async input => {
  const data = await clean(input)

  return archieml.load(data)
}
