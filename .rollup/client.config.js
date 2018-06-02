'use strict'

const path = require('path')

// Rollup plugins
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const { uglify } = require('rollup-plugin-uglify')
const { minify } = require('uglify-es')

const contextPath = path.resolve(__dirname, '../')
const p = rp => path.resolve(contextPath, rp)

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
      ? p('src/frontend/entries/app.js')
      : p('src/frontend/entries/app-dev.js'),
    p('src/frontend/entries/article.js'),
    p('src/frontend/entries/blog.js'),
    p('src/frontend/entries/home.js'),
    p('src/frontend/entries/not-found.js'),
    p('src/frontend/entries/project.js')
  ],
  plugins: [
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
  experimentalCodeSplitting: true,
  experimentalDynamicImport: true
}

module.exports = [
  {
    ...config,
    output: {
      dir: p('dist/client/module'),
      format: 'es',
      sourcemap: true
    }
  },
  {
    ...config,
    output: {
      dir: p('dist/client/nomodule'),
      format: 'system',
      sourcemap: true
    }
  }
]
