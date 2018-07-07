import config from './config'

import { Actions } from './actions'

const initialState = {
  authenticating: false,
  user: null,
  loginError: null
}

const authenticationReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case Actions.LOG_IN:
      return {...state, authenticating: true}

    case Actions.SET_USER:
      return {...state, user: action.user, authenticating: false}

    case Actions.SET_LOGIN_ERROR:
      return {...state, authenticating: false, loginError: action.error}

    case Actions.CLEAR_LOGIN_ERROR:
      return {...state, loginError: null}

    default:
      return state
  }
}

export default {
  [config.entityName]: authenticationReducer
}
