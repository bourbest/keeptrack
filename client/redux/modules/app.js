const actionPrefix = 'APP/'

// Action names
export const Actions = {
  SET_API_CONFIG: `${actionPrefix}SET_API_CONFIG`,
  SET_CSRF_TOKEN: `${actionPrefix}SET_CSRF_TOKEN`,
  SET_COOKIES: `${actionPrefix}SET_COOKIES`
}

export const ActionCreators = {
  setApiConfig: (config) => ({ type: Actions.SET_API_CONFIG, config }),
  setCsrfToken: (token) => ({ type: Actions.SET_CSRF_TOKEN, token }),
  setCookies: (cookies) => ({ type: Actions.SET_COOKIES, cookies })
}

const initialState = {
  apiConfig: {
    headers: {}
  }
}

export default function appReducer (state = initialState, action = {}) {
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
