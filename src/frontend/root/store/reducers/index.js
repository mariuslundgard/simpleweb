import { combineReducers } from 'redux'

import features from './features'
import home from './home'
import post from './post'
import route from './route'

export default combineReducers({ features, home, post, route })
