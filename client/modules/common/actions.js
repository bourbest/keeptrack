import { forEach } from 'lodash'
import { initialize, change } from 'redux-form'

export const standardActions = [
  'SET_LIST_FILTER',
  'SET_SORT_PARAMS',
  'FETCH_ALL',
  'SET_FETCHING',

  'SET_ENTITIES',
  'SET_SERVER_LIST_COUNT',

  'TOGGLE_SELECTED_ITEM',
  'CLEAR_SELECTED_ITEMS',

  'FETCH_EDITED_ENTITY',
  'SET_EDITED_ENTITY',
  'CLEAR_EDITED_ENTITY',

  'CREATE_REMOTE_ENTITY',
  'UPDATE_REMOTE_ENTITY',
  'DELETE_REMOTE_ENTITIES'
]

export const createActions = (prefix, actionNames) => {
  const actions = {}
  forEach(actionNames, (actionName) => { actions[actionName] = `${prefix}/${actionName}` })
  return actions
}

export const createBaseActionCreators = (actions, entityName) => {
  // const listFormName = `list-${entityName}`
  // const editFormName = `edit-${entityName}`
  return {
    // list stuff
    setListFilter: (filterValue) => ({ type: actions.SET_LIST_FILTER, filterValue }),
    setSortParams: (sortParams) => ({ type: actions.SET_SORT_PARAMS, sortParams }),
    fetchAll: (filters = null, replace = true) => ({ type: actions.FETCH_ALL, filters, replace }),
    setFetching: (isFetching) => ({ type: actions.SET_FETCHING, isFetching }),

    setEntities: (entities, replace) => ({ type: actions.SET_ENTITIES, entities, replace }),
    setServerListCount: (count) => ({ type: actions.SET_SERVER_LIST_COUNT, count }),
    toggleSelectedItem: (id) => ({type: actions.TOGGLE_SELECTED_ITEM, id}),
    clearSelectedItems: () => ({type: actions.CLEAR_SELECTED_ITEMS}),

    fetchEditedEntity: (id) => ({ type: actions.FETCH_EDITED_ENTITY, id }),
    setEditedEntity: (entity) => initialize(entityName, entity),
    setEditedEntityFieldValue: (field, value) => change(entityName, field, value),
    clearEditedEntity: () => initialize(entityName, null),

    createEntity: (entity, callback = null) => ({ type: actions.CREATE_REMOTE_ENTITY, entity, callback }),
    updateEntity: (entity, callback = null) => ({ type: actions.UPDATE_REMOTE_ENTITY, entity, callback }),
    deleteEntities: (remoteIds, callback = null) => ({ type: actions.DELETE_REMOTE_ENTITIES, remoteIds, callback })
  }
}
