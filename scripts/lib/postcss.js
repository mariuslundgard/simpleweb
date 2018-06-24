'use strict'

const fs = require('fs')
const postcss = require('postcss')
const postcssConfig = require('../../postcss.config')

function bundle (opts) {
  return new Promise((resolve, reject) => {
    const { from, to } = opts

    fs.readFile(from, (err, buf) => {
      if (err) {
        reject(err)
        return
      }

      postcss(postcssConfig.plugins)
        .process(buf, { from, to })
        .then(result => {
          fs.writeFile(to, result.css, fErr1 => {
            if (fErr1) {
              reject(fErr1)
              return
            }

            if (result.map) {
              fs.writeFile(to + '.map', result.map, fErr2 => {
                if (fErr2) {
                  reject(fErr2)
                  return
                }

                resolve()
              })
            } else {
              resolve()
            }
          })
        })
        .catch(err3 => {
          console.log(err3.stack)
        })
    })
  })
}

module.exports = { bundle }
