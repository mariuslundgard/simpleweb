// @flow

import type { FeaturesState } from '../types'

const DEFAULT: FeaturesState = {
  data: {
    features: null
  },
  errors: null,
  isLoading: false,
  isLoaded: false,
  isFailed: false,
  errorMessage: null
}

export default function features (state: FeaturesState = DEFAULT, msg: any) {
  switch (msg.type) {
    case 'features/REGISTER':
      return {
        ...state,
        data: {
          ...state.data,
          features: {
            ...state.data.features,
            [msg.key]: msg.value
          }
        }
      }

    case 'features/LOAD':
      return {
        ...state,
        isLoading: true
      }

    case 'features/LOAD_SUCCESS':
      return {
        ...state,
        data: msg.data || null,
        errors: msg.errors || null,
        isLoading: false,
        isLoaded: true
      }

    case 'features/LOAD_ERROR':
      return {
        ...state,
        isLoading: false,
        isFailed: true,
        errorMessage: msg.message
      }

    default:
      return state
  }
}
