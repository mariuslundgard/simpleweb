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
            src={`https://res.cloudinary.com/mariuslundgard/image/upload/v1493761086/${
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

ContentItem.criticalStyles = [
  `.ml-list {
    line-height: 1.333;
    padding: 0 15px 0 calc(2em + 15px);
    margin: 1em auto;
    max-width: 540px;
    box-sizing: border-box;
  }

  .ml-list > li {
    margin: 0.5em 0;
  }

  .ml-list > li > strong {
    /* font-family: 'Aldine 721 Std Bold', sans-serif; */
    font-weight: 700;
    /* color: #111; */
  }

  @media screen and (min-width: 720px) {
    .ml-list {
      line-height: 1.425;
    }
  }

  @media screen and (min-width: 900px) {
    .ml-list {
      font-size: 20px;
      max-width: 675px;
    }
  }`
].join('')

export default ContentItem
