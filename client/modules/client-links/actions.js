import config from './config'
import { createActions } from '../common/actions'

const prefix = config.entityName.toUpperCase()

export const Actions = createActions(prefix, [
  'LOAD_LINKS_FOR_CLIENT',
  'CREATE',
  'DELETE',
  'SET_FETCHING_ENTITY',
  'SET_LINKS',
  'ADD_LOCAL_LINK',
  'REMOVE_LOCAL_LINKS',
  'SET_SELECTED_CLIENT',
  'TOGGLE_SELECTED_ITEM',
  'CLEAR_SELECTED_ITEMS'
])

export const ActionCreators = {
  loadLinksForClient: (clientId) => ({type: Actions.LOAD_LINKS_FOR_CLIENT, clientId}),
  create: (clientId, otherClient, link, cb) => ({type: Actions.CREATE, clientId, otherClient, link, cb}),
  delete: (clientId, ids, cb) => ({type: Actions.DELETE, clientId, ids, cb}),
  setFetching: isFetching => ({type: Actions.SET_FETCHING_ENTITY, isFetching}),
  setLinks: links => ({type: Actions.SET_LINKS, links}),
  addLocalLink: (link) => ({type: Actions.ADD_LOCAL_LINK, link}),
  removeLocalLinks: (ids) => ({type: Actions.REMOVE_LOCAL_LINKS, ids}),
  setSelectedClient: client => ({type: Actions.SET_SELECTED_CLIENT, client}),
  toggleSelectedItem: id => ({type: Actions.TOGGLE_SELECTED_ITEM, id}),
  clearSelectedItems: () => ({type: Actions.CLEAR_SELECTED_ITEMS})
}
