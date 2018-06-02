// @flow

import type { HomeState } from '../types'

const DEFAULT: HomeState = {
  messages: [],
  data: null,
  errors: null,
  isLoading: false,
  isLoaded: false,
  isFailed: false,
  error: null
}

function home (state: HomeState = DEFAULT, msg: any) {
  // console.log(msg)

  switch (msg.type) {
    case 'home/MESSAGE':
      return { ...state, messages: state.messages.concat(msg.text) }
    case 'home/LOAD':
      return {
        ...state,
        isLoading: true
      }
    case 'home/LOAD_SUCCESS':
      return {
        ...state,
        data: msg.data,
        errors: msg.errors,
        isLoading: false,
        isLoaded: true
      }
    case 'home/LOAD_ERROR':
      return {
        ...state,
        data: msg.data,
        errors: msg.errors,
        isLoading: false,
        isFailed: true,
        error: msg.error
      }
    default:
      return state
  }
}

export default home
