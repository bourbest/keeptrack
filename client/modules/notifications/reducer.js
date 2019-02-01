import config from './config'
import { Actions } from './actions'
import {keyBy, omit, size} from 'lodash'

export const initialState = {
  isFetchingList: false,
  notifications: {}
}

const notificationsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case Actions.SET_NOTIFICATIONS:
      if (size(action.notifications) > 0) {
        const newNotifications = {...state.notifications, ...keyBy(action.notifications, 'id')}
        return {...state, notifications: newNotifications}
      }
      return state

    case Actions.MARK_LOCAL_AS_READ:
      return {...state, notifications: omit(state.notifications, action.id)}

    case Actions.SET_FETCHING_LIST:
      return {...state, isFetchingList: action.isFetching}

    default:
      return state
  }
}

export default {
  [config.entityName]: notificationsReducer
}
