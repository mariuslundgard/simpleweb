'use strict'

const path = require('path')

// Rollup plugins
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const { uglify } = require('rollup-plugin-uglify')
const { minify } = require('uglify-es')

const dist = relPath => path.resolve(__dirname, `../../dist/${relPath}`)
const src = relPath => path.resolve(__dirname, relPath)

const babelOpts = {
  presets: [
    [
      'env',
      {
        modules: false,
        targets: {
          browsers: ['last 2 versions', 'IE 10']
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

const config = {
  input: [
    process.env.NODE_ENV === 'production'
      ? src('root/entries/app.js')
      : src('root/entries/app-dev.js'),
    src('root/entries/article.js'),
    src('root/entries/home.js'),
    src('root/entries/project.js'),
    src('admin/root/entries/admin.js')
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
      exclude: path.resolve(__dirname, '../../node_modules/**')
    }),
    commonjs({
      extensions: ['.js']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      )
    }),
    process.env.NODE_ENV === 'production' && uglify({}, minify)
  ],
  experimentalCodeSplitting: true
}

module.exports = {
  css: [
    {
      from: src('admin/root/client.css'),
      to: dist('client/admin.css')
    },
    {
      from: src('root/client.css'),
      to: dist('client/app.css')
    },
    {
      from: src('maintenance/client.css'),
      to: dist('client/maintenance.css')
    }
  ],

  js: [
    {
      ...config,
      output: {
        dir: dist('client/module'),
        format: 'es',
        sourcemap: true
      }
    },
    {
      ...config,
      output: {
        dir: dist('client/nomodule'),
        format: 'system',
        sourcemap: true
      }
    }
  ]
}
