// @flow @jsx h

import { h } from 'preact'

function ContentItem (props: any) {
  const { item } = props

  switch (item.type) {
    case 'separator':
      return <hr class='ml-separator' />

    case 'list':
      return (
        <ul class='ml-list'>
          {item.value.content.map(item => {
            return <li dangerouslySetInnerHTML={{ __html: item.value }} />
          })}
        </ul>
      )

    case 'text':
      return (
        <p
          class='ml-paragraph'
          dangerouslySetInnerHTML={{ __html: item.value }}
        />
      )

    case 'figure':
      return (
        <figure class='ml-figure'>
          <img
            src={`http://res.cloudinary.com/mariuslundgard/image/upload/v1493761086/${
              item.value.src
            }`}
            style={{ width: '100%' }}
          />
          {item.value.caption && <figcaption>{item.value.caption}</figcaption>}
        </figure>
      )

    case 'section':
      return (
        <section class='ml-section'>
          {item.value.content.map((d, idx) => (
            <ContentItem key={String(idx)} item={d} />
          ))}
        </section>
      )

    default:
      return <div class='ml-unknown'>Unknown type: {item.type}</div>
  }
}

export default ContentItem
