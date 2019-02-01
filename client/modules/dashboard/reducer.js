import config from './config'
import { Actions } from './actions'
import {keyBy} from 'lodash'

export const initialState = {
  clientsById: {},
  isFetchingMyClients: false
}

const dashboardReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case Actions.SET_MY_CLIENTS:
      return {...state, clientsById: keyBy(action.clients, 'id')}

    case Actions.SET_FETCHING_MY_CLIENTS:
      return {...state, isFetchingMyClients: action.isFetching}

    default:
      return state
  }
}

export default {
  [config.entityName]: dashboardReducer
}
