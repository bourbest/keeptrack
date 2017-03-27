import config from './config'
import { baseInitialState, baseActionsHandler, inheritReducer } from '../helpers/reducers'
import { Actions } from './actions'

const initialState = {...baseInitialState, editedFieldName: null}

const specificReducer = (state, action) => {
  switch (action.type) {
    case Actions.SET_EDITED_FIELD:
      return {...state, editedFieldName: action.fieldName}

    default:
      return state
  }
}

export default {
  [config.storeBranch]: inheritReducer(Actions, initialState, baseActionsHandler, specificReducer)
}
