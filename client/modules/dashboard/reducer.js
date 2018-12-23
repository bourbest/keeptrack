import config from './config'
import { Actions } from './actions'
import {keyBy} from 'lodash'

export const initialState = {
  clientsById: {},
  isFetchingMyClients: false,

  notificationsById: {},
  isFetchingNotifications: false
}

const dashboardReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case Actions.SET_MY_CLIENTS:
      return {...state, clientsById: keyBy(action.clients, 'id')}

    case Actions.SET_FETCHING_MY_CLIENTS:
      return {...state, isFetchingMyClients: action.isFetching}

    case Actions.SET_NOTIFICATIONS:
      return {...state, notificationsById: keyBy(action.notifications, 'id')}

    case Actions.SET_FETCHING_NOTIFICATIONS:
      return {...state, isFetchingNotifications: action.isFetching}

    default:
      return state
  }
}

export default {
  [config.entityName]: dashboardReducer
}
