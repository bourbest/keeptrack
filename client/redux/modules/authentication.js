import jwtDecode from 'jwt-decode'
import { trim, forEach } from 'lodash'
// import moment from 'moment'
import { normalize } from '../../services/format'

const actionPrefix = 'AUTH/'

// Action names
export const Actions = {
  LOG_IN: `${actionPrefix}LOG_IN`,
  SET_TICKET: `${actionPrefix}SET_TICKET`,
  LOG_OUT: `${actionPrefix}LOG_OUT`,

  SET_LOGIN_ERROR: `${actionPrefix}SET_LOGIN_ERROR`,
  CLEAR_LOGIN_ERROR: `${actionPrefix}CLEAR_LOGIN_ERROR`
}

export const ActionCreators = {
  loginUser: (username, password, redirect) => ({ type: Actions.LOG_IN, username, password, redirect }),
  setTicket: (ticket) => ({ type: Actions.SET_TICKET, ticket }),
  logoutUser: () => ({ type: Actions.LOG_OUT }),

  setLoginError: (error) => ({ type: Actions.SET_LOGIN_ERROR, error }),
  clearLoginError: (error) => ({ type: Actions.CLEAR_LOGIN_ERROR, error: error })
}

const initialState = {
  authenticating: false,
  user: null,
  loginError: null
}

function convertPermissions (strPermissions = '') {
  const ret = {}
  const keys = strPermissions.split(',')
  forEach(keys, (key) => {
    key = trim(key)
    if (key !== '') {
      ret[key] = true
    }
  })

  return ret
}

function deserializeTicket (ticket) {
  if (!ticket || ticket === '') {
    return null
  }

  let userModel = {}
  const serverModel = jwtDecode(ticket)

  for (let key in serverModel) {
    if (key.indexOf('KT:') === 0) {
      userModel[key.substring(3)] = serverModel[key]
    }
  }

  userModel.userId = serverModel.nameid
  userModel.userName = serverModel.unique_name
  // userModel.expires = moment('1970-01-01 0:00 +0000').add(serverModel.exp, 'seconds')

  userModel = normalize(userModel)

  userModel.permissions = convertPermissions(userModel.permissions)

  return userModel
}

export default function authenticationReducer (state = initialState, action = {}) {
  switch (action.type) {
    case Actions.LOG_IN:
      return {...state, authenticating: true}

    case Actions.SET_TICKET:
      const user = deserializeTicket(action.ticket)
      return {...state, user, authenticating: false}

    case Actions.SET_LOGIN_ERROR:
      return {...state, authenticating: false, loginError: action.error}

    case Actions.CLEAR_LOGIN_ERROR:
      return {...state, loginError: null}

    default:
      return state
  }
}
