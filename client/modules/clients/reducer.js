import config from './config'
import { baseInitialState, baseActionsHandler, inheritReducer } from '../common/reducers'
import { Actions } from './actions'

const initialState = {...baseInitialState, sortParams: [{field: 'names.fr', direction: 'ASC'}]}

const specificReducer = (state, action) => {
  return state
}

export default {
  [config.storeBranch]: inheritReducer(Actions, initialState, baseActionsHandler, specificReducer)
}
