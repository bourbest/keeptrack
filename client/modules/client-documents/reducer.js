import config from './config'
import { Actions } from './actions'

const initialState = {
  client: null
}

const clientDocumentReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case Actions.SET_CLIENT:
      return {...state, client: action.client}

    default:
      return state
  }
}

export default {
  [config.entityName]: clientDocumentReducer
}
