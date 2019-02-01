import config from './config'
import { stopSubmit } from 'redux-form'
import { createActions } from '../common/actions'
const prefix = 'AUTH/'

const actions = [
  'LOG_IN',
  'SET_USER',
  'LOG_OUT'
]

export const Actions = createActions(prefix, actions)

export const ActionCreators = {
  loginUser: (username, password, redirect) => ({ type: Actions.LOG_IN, username, password, redirect }),
  setUser: (user) => ({ type: Actions.SET_USER, user }),
  logoutUser: () => ({ type: Actions.LOG_OUT }),

  clearLoginError: () => stopSubmit(config.entityName, null)
}
