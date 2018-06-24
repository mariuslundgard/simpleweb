// @flow

import Article from './Article'
import Home from './Home'
import Project from './Project'
import NotFound from './NotFound'
import ErrorScreen from './ErrorScreen'

const screens = {
  article: Article,
  home: Home,
  project: Project,
  error: ErrorScreen,
  notFound: NotFound
}

export { ErrorScreen, NotFound }
export default screens
