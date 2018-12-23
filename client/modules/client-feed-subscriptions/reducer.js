import config from './config'
import { baseInitialState, baseActionsHandler, inheritReducer } from '../common/reducers'
import { Actions } from './actions'
import {keyBy} from 'lodash'

const initialState = {
  ...baseInitialState
}

const specificReducer = (state, action) => {
  switch (action.type) {
    case Actions.ADD_LOCAL_ENTITIES:
      const totalCount = state.serverListCount + action.entities.length
      const byId = {...state.byId, ...keyBy(action.entities, 'id')}
      return {...state, byId, totalCount}
  }
  return state
}

export default {
  [config.entityName]: inheritReducer(Actions, initialState, baseActionsHandler, specificReducer)
}
