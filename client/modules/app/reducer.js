import config from './config'
import { Actions } from './actions'

const initialState = {
  apiConfig: {
    headers: {
    }
  },
  displayedModalName: null,
  locale: 'fr'
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

    case Actions.SHOW_MODAL:
      return {...state, displayedModalName: action.modalName}

    case Actions.HIDE_MODAL:
      return {...state, displayedModalName: null}

    case Actions.SET_COOKIES:
      newState.apiConfig.headers['Cookie'] = action.cookies
      return newState

    case Actions.SET_LOCALE:
      newState.locale = action.locale
      return newState
    case Actions.SET_CATALOG_ID:
      newState.catalogId = action.catalogId
      return newState

    default:
      return state
  }
}

export default {
  [config.entityName]: appReducer
}
