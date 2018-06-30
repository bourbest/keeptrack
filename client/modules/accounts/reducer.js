import config from './config'
import { baseInitialState, baseActionsHandler, inheritReducer } from '../common/reducers'
import { Actions } from './actions'

const specificReducer = (state, action) => {
  return state
}

export default {
  [config.entityName]: inheritReducer(Actions, baseInitialState, baseActionsHandler, specificReducer)
}
