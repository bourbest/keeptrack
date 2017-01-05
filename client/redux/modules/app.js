const actionPrefix = 'APP/'

// Action names
export const Actions = {
  SET_API_CONFIG: `${actionPrefix}SET_API_CONFIG`,
  SET_API_HEADER: `${actionPrefix}SET_API_HEADER`
}

export const ActionCreators = {
  setApiConfig: (config) => ({ type: Actions.SET_API_CONFIG, config }),
  setApiHeader: (headerName, value) => ({ type: Actions.SET_API_HEADER, headerName, value })
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

    case Actions.SET_API_HEADER:
      newState.apiConfig.headers[action.headerName] = action.value
      return newState

    default:
      return state
  }
}
