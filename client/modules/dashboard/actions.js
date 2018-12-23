import config from './config'
import { createActions } from '../common/actions'

const prefix = config.entityName.toUpperCase()

export const Actions = createActions(prefix, [
  'FETCH_MY_CLIENTS', // saga
  'SET_FETCHING_MY_CLIENTS',
  'SET_MY_CLIENTS',

  'FETCH_NOTIFICATIONS', // saga
  'SET_NOTIFICATIONS',
  'SET_FETCHING_NOTIFICATIONS'
])

export const ActionCreators = {
  fetchMyClients: () => ({ type: Actions.FETCH_MY_CLIENTS }),
  setMyClients: (clients) => ({type: Actions.SET_MY_CLIENTS, clients}),
  setFetchingMyClients: (isFetching) => ({type: Actions.SET_FETCHING_MY_CLIENTS, isFetching}),

  fetchNotifications: () => ({ type: Actions.FETCH_NOTIFICATIONS }),
  setNotifications: (notifications) => ({type: Actions.SET_NOTIFICATIONS, notifications}),
  setFetchingNotifications: (isFetching) => ({ type: Actions.SET_FETCHING_NOTIFICATIONS, isFetching })
}
