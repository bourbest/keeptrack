import config from './config'
import { baseInitialState, baseActionsHandler, inheritReducer } from '../helpers/reducers'
import { Actions } from './actions'

const initialState = {...baseInitialState}

export default {
  [config.storeBranch]: inheritReducer(Actions, initialState, baseActionsHandler)
}
