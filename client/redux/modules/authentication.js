import moment from 'moment'

const actionPrefix = 'AUTH/'

// Action names
export const Actions = {
  LOG_IN: `${actionPrefix}LOG_IN`,
  SET_SESSION_INFO: `${actionPrefix}SET_SESSION_INFO`,
  LOG_OUT: `${actionPrefix}LOG_OUT`,

  SET_LOGIN_ERROR: `${actionPrefix}SET_LOGIN_ERROR`,
  CLEAR_LOGIN_ERROR: `${actionPrefix}CLEAR_LOGIN_ERROR`
}

export const ActionCreators = {
  loginUser: (username, password, redirect) => ({ type: Actions.LOG_IN, username, password, redirect }),
  setSessionInfo: (sessionInfo) => ({ type: Actions.SET_SESSION_INFO, sessionInfo }),
  logoutUser: () => ({ type: Actions.LOG_OUT }),

  setLoginError: (error) => ({ type: Actions.SET_LOGIN_ERROR, error }),
  clearLoginError: () => ({ type: Actions.CLEAR_LOGIN_ERROR })
}

const initialState = {
  authenticating: false,
  user: null,
  expiresOn: null,
  loginError: null
}

export default function authenticationReducer (state = initialState, action = {}) {
  switch (action.type) {
    case Actions.LOG_IN:
      return {...state, authenticating: true}

    case Actions.SET_SESSION_INFO:
      return Object.assign({}, state, {
        user: action.sessionInfo.identity,
        expiresOn: moment(action.sessionInfo.expiresOn),
        authenticating: false
      })

    case Actions.SET_LOGIN_ERROR:
      return {...state, authenticating: false, loginError: action.error}

    case Actions.CLEAR_LOGIN_ERROR:
      return {...state, loginError: null}

    default:
      return state
  }
}
