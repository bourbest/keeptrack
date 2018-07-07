const actionPrefix = 'AUTH/'

export const Actions = {
  LOG_IN: `${actionPrefix}LOG_IN`,
  SET_USER: `${actionPrefix}SET_USER`,
  LOG_OUT: `${actionPrefix}LOG_OUT`,

  SET_LOGIN_ERROR: `${actionPrefix}SET_LOGIN_ERROR`,
  CLEAR_LOGIN_ERROR: `${actionPrefix}CLEAR_LOGIN_ERROR`
}

export const ActionCreators = {
  loginUser: (username, password, redirect) => ({ type: Actions.LOG_IN, username, password, redirect }),
  setUser: (user) => ({ type: Actions.SET_USER, user }),
  logoutUser: () => ({ type: Actions.LOG_OUT }),

  setLoginError: (error) => ({ type: Actions.SET_LOGIN_ERROR, error }),
  clearLoginError: (error) => ({ type: Actions.CLEAR_LOGIN_ERROR, error: error })
}
