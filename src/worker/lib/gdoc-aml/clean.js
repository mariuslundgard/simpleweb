'use strict'

const Entities = require('html-entities').AllHtmlEntities
const htmlparser = require('htmlparser2')
const url = require('url')

const LIST_TAGS = ['ul', 'ol']
const HEADER_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

const tagHandlers = {
  _base (tag) {
    let str = ''
    tag.children.forEach(child => {
      const func = tagHandlers[child.name || child.type]
      if (func) str += func(child)
    })
    return str
  },
  text (textTag) {
    return textTag.data
  },
  span (spanTag) {
    return tagHandlers._base(spanTag)
  },
  strong (strongTag) {
    return tagHandlers._base(strongTag)
  },
  em (emTag) {
    return tagHandlers._base(emTag)
  },
  p (pTag) {
    return tagHandlers._base(pTag) + '\n'
  },
  a (aTag) {
    let href = aTag.attribs.href
    if (href === undefined) return ''
    // extract real URLs from Google's tracking
    if (
      aTag.attribs.href &&
      url.parse(aTag.attribs.href, true).query &&
      url.parse(aTag.attribs.href, true).query.q
    ) {
      href = url.parse(aTag.attribs.href, true).query.q
    }
    return `<a href="${href}">${tagHandlers._base(aTag)}</a>`
  },
  li (liTag) {
    return `* ${tagHandlers._base(liTag)}\n`
  }
}

LIST_TAGS.forEach(tag => {
  tagHandlers[tag] = tagHandlers.span
})

HEADER_TAGS.forEach(tag => {
  tagHandlers[tag] = tagHandlers.p
})

exports.clean = input =>
  new Promise((resolve, reject) => {
    if (input.length === 0) {
      resolve('')
      return
    }

    const handler = new htmlparser.DomHandler((parseErr, dom) => {
      if (parseErr) {
        reject(parseErr)
      } else {
        // console.log(dom)

        if (!dom[0]) {
          resolve('')
        }

        const body = dom[0].children[1]

        let output = tagHandlers._base(body)

        // Convert html entities into the characters as they exist in the google doc
        const entities = new Entities()
        output = entities.decode(output)

        // Remove smart quotes from inside tags
        output = output.replace(/<[^<>]*>/g, match => {
          return match.replace(/â€|â€œ/g, '"').replace(/â€˜|â€™/g, "'")
        })

        // console.log('_______')
        // console.log(output)

        resolve(output)
      }
    })

    const parser = new htmlparser.Parser(handler)

    parser.write(input)
    parser.done()
  })
