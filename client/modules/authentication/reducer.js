import jwtDecode from 'jwt-decode'
import { trim, forEach, camelCase } from 'lodash'

import config from './config'

import { Actions } from './actions'

const initialState = {
  authenticating: false,
  user: null,
  loginError: null
}

function convertPermissions (strPermissions = '') {
  const ret = []
  const keys = strPermissions.split(',')
  forEach(keys, (key) => {
    key = trim(key)
    if (key !== '') {
      ret.push(key)
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
      userModel[camelCase(key.substring(3))] = serverModel[key]
    }
  }

  userModel.userId = serverModel.nameid
  userModel.userName = serverModel.unique_name
  // userModel.expires = moment('1970-01-01 0:00 +0000').add(serverModel.exp, 'seconds')

  userModel.permissions = convertPermissions(userModel.permissions)

  return userModel
}

const authenticationReducer = (state = initialState, action = {}) => {
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

export default {
  [config.entityName]: authenticationReducer
}
