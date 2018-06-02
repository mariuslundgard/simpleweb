'use strict'

const path = require('path')

// Rollup plugins
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')

const babelOpts = {
  presets: [
    [
      'env',
      {
        modules: false,
        targets: {
          node: '10.3.1'
        }
      }
    ]
  ],
  plugins: [
    'external-helpers',
    'transform-class-properties',
    'transform-flow-strip-types',
    'transform-object-rest-spread',
    ['transform-react-jsx', { pragma: 'h' }],
    'syntax-dynamic-import'
  ]
}

module.exports = {
  input: path.resolve(__dirname, '../src/server.js'),
  output: {
    file: path.resolve(__dirname, '../dist/server/index.js'),
    format: 'cjs',
    sourcemap: true
  },
  external: [
    'body-parser',
    'date-fns',
    'express',
    'express-graphql',
    'graphql',
    'http-auth',
    'lodash.camelcase',
    'redis',
    'request',
    'superagent',
    'util'
  ],
  plugins: [
    resolve({
      customResolveOptions: {
        paths: process.env.NODE_PATH.split(/[;:]/)
      },
      jsnext: true,
      main: true,
      browser: true
    }),
    babel({
      ...babelOpts,
      babelrc: false,
      // only transpile source code
      exclude: path.resolve(__dirname, '../node_modules/**')
    }),
    commonjs({
      extensions: ['.js']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      )
    })
  ]
}
