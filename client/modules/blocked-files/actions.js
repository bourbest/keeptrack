import config from './config'
import { createActions } from '../common/actions'

const prefix = config.entityName.toUpperCase()

export const Actions = createActions(prefix, [
  'LOAD_BLOCKED_FILES_FOR_USER',
  'CREATE',
  'DELETE',
  'SET_FETCHING_ENTITY',
  'SET_BLOCKED_FILES',
  'ADD_LOCAL_BLOCKED_FILE',
  'REMOVE_LOCAL_BLOCKED_FILES',
  'SET_SELECTED_CLIENT',
  'TOGGLE_SELECTED_ITEM',
  'CLEAR_SELECTED_ITEMS'
])

export const ActionCreators = {
  loadBlockedFilesForUser: (userId) => ({type: Actions.LOAD_BLOCKED_FILES_FOR_USER, userId}),
  create: (userId, client, blockedFile, cb) => ({type: Actions.CREATE, userId, client, blockedFile, cb}),
  delete: (userId, ids, cb) => ({type: Actions.DELETE, userId, ids, cb}),
  setFetching: isFetching => ({type: Actions.SET_FETCHING_ENTITY, isFetching}),
  setBlockedFiles: blockedFiles => ({type: Actions.SET_BLOCKED_FILES, blockedFiles}),
  addLocalBlockedFile: (blockedFile) => ({type: Actions.ADD_LOCAL_BLOCKED_FILE, blockedFile}),
  removeLocalBlockedFile: (ids) => ({type: Actions.REMOVE_LOCAL_BLOCKED_FILES, ids}),
  setSelectedClient: client => ({type: Actions.SET_SELECTED_CLIENT, client}),
  toggleSelectedItem: id => ({type: Actions.TOGGLE_SELECTED_ITEM, id}),
  clearSelectedItems: () => ({type: Actions.CLEAR_SELECTED_ITEMS})
}
