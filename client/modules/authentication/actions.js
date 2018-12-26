import config from './config'
import { stopSubmit } from 'redux-form'
const actionPrefix = 'AUTH/'

export const Actions = {
  LOG_IN: `${actionPrefix}LOG_IN`,
  SET_USER: `${actionPrefix}SET_USER`,
  LOG_OUT: `${actionPrefix}LOG_OUT`
}

export const ActionCreators = {
  loginUser: (username, password, redirect) => ({ type: Actions.LOG_IN, username, password, redirect }),
  setUser: (user) => ({ type: Actions.SET_USER, user }),
  logoutUser: () => ({ type: Actions.LOG_OUT }),

  clearLoginError: () => stopSubmit(config.entityName, null)
}
