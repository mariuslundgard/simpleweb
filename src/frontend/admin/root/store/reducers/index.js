import { combineReducers } from 'redux'

import features from './features'
import home from './home'
import route from './route'
import tasks from './tasks'

export default combineReducers({
  features,
  home,
  route,
  tasks
})
