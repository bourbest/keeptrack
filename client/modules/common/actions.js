import { forEach } from 'lodash'
import { initialize, change, reset } from 'redux-form'

export const standardActions = [
  'SET_LIST_LOCAL_FILTERS',
  'SET_LIST_SERVER_FILTERS',
  'SET_FILTER_VALUE',
  'SET_SORT_PARAMS',
  'FETCH_ALL',
  'SET_FETCHING',
  'SET_LIST_LOADED',

  'SET_ENTITIES',
  'REMOVE_LOCAL_ENTITIES',

  'TOGGLE_SELECTED_ITEM',
  'CLEAR_SELECTED_ITEMS',

  'FETCH_EDITED_ENTITY',

  'CREATE_REMOTE_ENTITY',
  'UPDATE_REMOTE_ENTITY',
  'DELETE_REMOTE_ENTITIES',
  'RESTORE_REMOTE_ENTITY'
]

export const createActions = (prefix, actionNames) => {
  const actions = {}
  forEach(actionNames, (actionName) => { actions[actionName] = `${prefix}/${actionName}` })
  return actions
}

export const createBaseActionCreators = (actions, entityName) => {
  return {
    // list stuff
    setListLocalFilters: (filters) => ({ type: actions.SET_LIST_LOCAL_FILTERS, filters }),
    setListServerFilters: (filters) => ({ type: actions.SET_LIST_SERVER_FILTERS, filters }),
    setFilterValue: (filterName, value, isServer = false) => ({ type: actions.SET_FILTER_VALUE, filterName, value, isServer }),

    setSortParams: (sortParams) => ({ type: actions.SET_SORT_PARAMS, sortParams }),
    fetchAll: (filters = null, replace = false) => ({ type: actions.FETCH_ALL, filters, replace }),
    setFetching: (isFetching) => ({ type: actions.SET_FETCHING, isFetching }),
    setListLoaded: (isLoaded) => ({ type: actions.SET_LIST_LOADED, isLoaded }),

    setEntities: (entities, replace) => ({ type: actions.SET_ENTITIES, entities, replace }),
    removeLocalEntities: (entityIds) => ({ type: actions.REMOVE_LOCAL_ENTITIES, entityIds }),

    toggleSelectedItem: (id) => ({type: actions.TOGGLE_SELECTED_ITEM, id}),
    clearSelectedItems: () => ({type: actions.CLEAR_SELECTED_ITEMS}),

    fetchEditedEntity: (id) => ({ type: actions.FETCH_EDITED_ENTITY, id }),
    setEditedEntity: (entity) => initialize(entityName, entity),
    setEditedEntityFieldValue: (field, value) => change(entityName, field, value),
    resetEditedEntity: () => reset(entityName),
    clearEditedEntity: () => initialize(entityName, null),

    createEntity: (entity, callback = null) => ({ type: actions.CREATE_REMOTE_ENTITY, entity, callback }),
    updateEntity: (entity, callback = null) => ({ type: actions.UPDATE_REMOTE_ENTITY, entity, callback }),
    deleteEntities: (remoteIds, callback = null) => ({ type: actions.DELETE_REMOTE_ENTITIES, remoteIds, callback }),
    restoreEntity: (entity, callback = null) => ({ type: actions.UPDATE_REMOTE_ENTITY, entity, callback })
  }
}
