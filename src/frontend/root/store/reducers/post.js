// @flow

import type { PostState } from '../types'

const DEFAULT: PostState = {
  data: null,
  errors: null,
  isLoading: false,
  isLoaded: false,
  isFailed: false,
  error: null
}

function post (state: PostState = DEFAULT, msg: any) {
  switch (msg.type) {
    case 'post/LOAD':
      return {
        ...state,
        isLoading: true
      }

    case 'post/LOAD_SUCCESS':
      return {
        ...state,
        data: msg.data,
        errors: msg.errors,
        isLoading: false,
        isLoaded: true
      }

    case 'post/LOAD_ERROR':
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

export default post
