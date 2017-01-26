import config from './config'
import { Actions } from './actions'

const initialState = {
  apiConfig: {
    headers: {}
  }
}

const appReducer = (state = initialState, action = {}) => {
  const newState = {...state}
  switch (action.type) {
    case Actions.SET_API_CONFIG:
      newState.apiConfig = {...state.apiConfig, ...action.config}
      return newState

    case Actions.SET_CSRF_TOKEN:
      newState.apiConfig.headers['X-CSRF-Token'] = action.token
      return newState

    case Actions.SET_COOKIES:
      newState.apiConfig.headers['Cookie'] = action.cookies
      return newState

    default:
      return state
  }
}

export default {
  [config.storeBranch]: appReducer
}
