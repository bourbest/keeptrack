import config from './config'
import { Actions } from './actions'
import {orderBy, findIndex} from 'lodash'

export const initialState = {
  isFetchingList: false,
  notifications: []
}

const notificationsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case Actions.SET_NOTIFICATIONS:
      const newNotifications = [...state.notifications, ...action.notifications]
      orderBy(newNotifications, ['createdOn'], ['desc'])
      return {...state, notifications: newNotifications}

    case Actions.MARK_LOCAL_AS_READ:
      const idx = findIndex(state.notifications, {id: action.id})
      state.notifications[idx] = {
        ...state.notifications[idx],
        isRead: action.isRead
      }
      return {...state, notifications: [...state.notifications]}

    case Actions.SET_FETCHING_LIST:
      return {...state, isFetchingList: action.isFetching}

    default:
      return state
  }
}

export default {
  [config.entityName]: notificationsReducer
}
