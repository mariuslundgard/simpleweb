// @flow @jsx h

// import { format } from 'date-fns'
import { Component, h } from 'preact'
// import style from './index.css'

type Post = {
  type: 'article' | 'project',
  id: string,
  name: string,
  publishedTime: string
}

type Article = {
  type: 'article',
  id: string,
  name: string,
  publishedTime: string
}

type Project = {
  type: 'project',
  id: string,
  name: string,
  publishedTime: string
}

type Data = {
  articles: Article[],
  projects: Project[],
  modifiedTime: string,
  posts: Post[]
}

type Props = {
  data?: Data,
  query: any
}

// type State = any

class Home extends Component<Props> {
  // static reduce (state: State) {
  //   return state
  // }

  static query (params: any, query: any) {
    if (query.keyword) {
      return `{
        modifiedTime
        articles: posts (keyword: "${query.keyword}", type: "article") {
          id
          type
          name
          publishedTime
        }
        projects: posts (keyword: "${query.keyword}", type: "project") {
          id
          type
          name
          publishedTime
        }
      }`
    }

    return `{
      modifiedTime
      articles: posts (type: "article") {
        id
        type
        name
        publishedTime
      }
      projects: posts (type: "project") {
        id
        type
        name
        publishedTime
      }
    }`
  }

  render () {
    const { onLinkClick } = this.context
    const { data, query } = this.props

    // console.log(this.props)

    if (!data) {
      return <div class='web-home web-home--laster'>Laster...</div>
    }

    const modifiedTime = data.modifiedTime
    const articles = data.articles || []
    const projects = data.projects || []

    return (
      <div class='web-home'>
        <div>Modified {modifiedTime}</div>

        {articles.length > 0 && (
          <div>
            {query.keyword ? (
              <h2>Articles ({query.keyword})</h2>
            ) : (
              <h2>Articles</h2>
            )}
            <ol>
              {articles.map(post => (
                <li key={post.id}>
                  <a href={`/${post.type}/${post.id}`} onClick={onLinkClick}>
                    {post.name} ({post.publishedTime})
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}

        {projects.length > 0 && (
          <div>
            {query.keyword ? (
              <h2>Projects ({query.keyword})</h2>
            ) : (
              <h2>Projects</h2>
            )}
            <ol>
              {projects.map(post => (
                <li key={post.id}>
                  <a href={`/${post.type}/${post.id}`} onClick={onLinkClick}>
                    {post.name} ({post.publishedTime})
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    )
  }
}

export default Home
