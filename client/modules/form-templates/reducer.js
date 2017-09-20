import config from './config'
import { baseInitialState, baseActionsHandler, inheritReducer } from '../common/reducers'
import { Actions } from './actions'

const initialState = {...baseInitialState, sortParams: [{field: 'name', direction: 'ASC'}]}

const specificReducer = (state, action) => {
  return state
}

export default {
  [config.entityName]: inheritReducer(Actions, initialState, baseActionsHandler, specificReducer)
}
