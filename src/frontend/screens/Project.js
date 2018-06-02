// @flow @jsx h

import { Component, h } from 'preact'

type Params = {
  id: string
}

function ContentItem (props: any) {
  const { item } = props

  switch (item.type) {
    case 'text':
      return <p>{item.value}</p>

    case 'figure':
      return (
        <figure>
          <img
            src={`http://res.cloudinary.com/mariuslundgard/image/upload/v1493761086/${
              item.value.src
            }`}
            style={{ width: '100%' }}
          />
          {item.value.caption && <figcaption>{item.value.caption}</figcaption>}
        </figure>
      )

    default:
      return <div>{item.type}</div>
  }
}

class Project extends Component<any> {
  static query (params: Params, query: any) {
    return `{
      post(id: "${params.id}") {
        name
        title
        content
        publishedTime
        keywords
      }
    }`
  }

  render () {
    const { onLinkClick } = this.context
    const { data, errors } = this.props

    if (errors) {
      return <pre>{JSON.stringify(errors)}</pre>
    }

    if (!data) {
      return <div>Loading...</div>
    }

    // console.log(data.post)

    return (
      <article>
        <h1>{data.post.title || data.post.name}</h1>
        <div>{data.post.publishedTime}</div>
        <ul>
          {data.post.keywords.map(keyword => (
            <li>
              <a
                key={keyword}
                href={`/?keyword=${keyword}`}
                onClick={onLinkClick}
              >
                {keyword}
              </a>
            </li>
          ))}
        </ul>
        <div>
          {data.post.content.map((item, idx) => (
            <ContentItem key={String(idx)} item={item} />
          ))}
        </div>
      </article>
    )
  }
}

export default Project
