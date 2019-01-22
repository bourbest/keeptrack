import config from './config'
import { createActions } from '../common/actions'

const prefix = config.entityName.toUpperCase()

export const Actions = createActions(prefix, [
  'FETCH_NOTIFICATIONS', // saga
  'SET_NOTIFICATIONS',
  'SET_FETCHING_LIST',

  'START_POLLING',
  'STOP_POLLING',

  'MARK_REMOTE_AS_READ',
  'MARK_LOCAL_AS_READ'  // called by saga
])

export const ActionCreators = {
  fetchNotifications: () => ({ type: Actions.FETCH_NOTIFICATIONS }),
  setNotifications: (notifications) => ({type: Actions.SET_NOTIFICATIONS, notifications}),
  setFetchingList: (isFetching) => ({ type: Actions.SET_FETCHING_LIST, isFetching }),

  startPolling: () => ({type: Actions.START_POLLING}),
  stopPolling: () => ({type: Actions.STOP_POLLING}),

  markAsRead: (id, callback = null) => ({ type: Actions.MARK_REMOTE_AS_READ, id, callback }),
  markLocalAsRead: (id) => ({ type: Actions.MARK_LOCAL_AS_READ, id })
}
