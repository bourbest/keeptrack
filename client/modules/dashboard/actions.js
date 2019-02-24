import config from './config'
import { createActions } from '../common/actions'

const prefix = config.entityName.toUpperCase()

export const Actions = createActions(prefix, [
  'FETCH_MY_CLIENTS', // saga
  'SET_FETCHING_MY_CLIENTS',
  'SET_MY_CLIENTS',

  'FETCH_MY_INCOMPLETE_DOCUMENTS',
  'SET_FETCHING_MY_INCOMPLETE_DOCUMENTS',
  'SET_MY_INCOMPLETE_DOCUMENTS'
])

export const ActionCreators = {
  fetchMyClients: () => ({ type: Actions.FETCH_MY_CLIENTS }),
  setMyClients: (clients) => ({type: Actions.SET_MY_CLIENTS, clients}),
  setFetchingMyClients: (isFetching) => ({type: Actions.SET_FETCHING_MY_CLIENTS, isFetching}),

  fetchMyIncompleteDocuments: () => ({ type: Actions.FETCH_MY_INCOMPLETE_DOCUMENTS }),
  setMyIncompleteDocuments: (documents) => ({type: Actions.SET_MY_INCOMPLETE_DOCUMENTS, documents}),
  setFetchingMyIncompleteDocuments: (isFetching) => ({type: Actions.SET_FETCHING_MY_INCOMPLETE_DOCUMENTS, isFetching})
}
