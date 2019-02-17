import config from './config'
import { Actions } from './actions'

const initialState = {
  client: null,
  isFetching: false,
  formTemplate: null
}

const clientDocumentReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case Actions.SET_CLIENT:
      return {...state, client: action.client}

    case Actions.SET_FETCHING_ENTITY:
      return {...state, isFetching: action.isFetching}

    case Actions.SET_TEMPLATE:
      return {...state, formTemplate: action.template}

    default:
      return state
  }
}

export default {
  [config.entityName]: clientDocumentReducer
}
