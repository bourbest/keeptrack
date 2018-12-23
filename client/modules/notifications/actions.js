import config from './config'
import { createActions } from '../common/actions'

const prefix = config.entityName.toUpperCase()

export const Actions = createActions(prefix, [
  'FETCH_NOTIFICATIONS', // saga
  'SET_NOTIFICATIONS',
  'SET_FETCHING_LIST',

  'MARK_REMOTE_AS_READ',
  'MARK_LOCAL_AS_READ'  // called by saga
])

export const ActionCreators = {
  fetchNotifications: (fromId, fromDate) => ({ type: Actions.FETCH_NOTIFICATIONS, fromId, fromDate }),
  setNotifications: (notifications) => ({type: Actions.SET_NOTIFICATIONS, notifications}),
  setFetchingList: (isFetching) => ({ type: Actions.SET_FETCHING_LIST, isFetching }),

  markRemoteAsRead: (id, isRead, callback = null) => ({ type: Actions.MARK_REMOTE_AS_READ, id, isRead, callback }),
  markLocalAsRead: (id, isRead) => ({ type: Actions.MARK_LOCAL_AS_READ, id, isRead })
}
