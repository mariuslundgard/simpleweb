// @flow

import Article from './Article'
import Blog from './Blog'
import Home from './Home'
import Project from './Project'
import NotFound from './NotFound'

const screens = {
  article: Article,
  blog: Blog,
  home: Home,
  project: Project
}

export { NotFound }
export default screens
