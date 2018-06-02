'use strict'

const path = require('path')
// const postcssConfig = require('../postcss.config')

// Rollup plugins
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
// const json = require('rollup-plugin-json')
const resolve = require('rollup-plugin-node-resolve')
const postcss = require('rollup-plugin-postcss')
const replace = require('rollup-plugin-replace')
// const { uglify } = require('rollup-plugin-uglify')

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
    [
      'css-modules-transform',
      {
        generateScopedName: 'web-[local]',
        extensions: ['.css']
      }
    ],
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
    'archieml',
    'date-fns',
    'express',
    'express-graphql',
    'graphql',
    'html-entities',
    'htmlparser2',
    'jsonwebtoken',
    'request',
    'stale-lru-cache',
    'qs',
    'url'
  ],
  plugins: [
    postcss({
      extract: false
    }),
    resolve({
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
    // json({
    //   include: 'node_modules/**'
    // }),
    commonjs({
      extensions: ['.js']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      )
    })
    // process.env.NODE_ENV === 'production' && uglify()
  ]
}
