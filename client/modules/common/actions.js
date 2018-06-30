import { forEach } from 'lodash'
import { initialize, change, reset } from 'redux-form'

export const standardActions = [
  // common list actions
  'FETCH_LIST', // saga
  'SET_ENTITY_PAGE',
  'SET_FETCHING_LIST',
  'RESET_FETCH_CONTEXT',
  'REMOVE_LOCAL_ENTITIES',

  'TOGGLE_SELECTED_ITEM',
  'CLEAR_SELECTED_ITEMS',

  // common crud actions
  'FETCH_ENTITY',  // saga
  'SET_FETCHING_ENTITY', // saga
  'SAVE_REMOTE_ENTITY', // saga
  'DELETE_REMOTE_ENTITIES' // saga
]

export const createActions = (prefix, actionNames) => {
  const actions = {}
  forEach(actionNames, (actionName) => { actions[actionName] = `${prefix}/${actionName}` })
  return actions
}

export const createBaseActionCreators = (actions, entityName) => {
  return {
    fetchList: (serverFilters) => ({ type: actions.FETCH_LIST, serverFilters }),
    setEntitiesPage: (pageContext, entities, totalCount) => ({type: actions.SET_ENTITY_PAGE, pageContext, entities, totalCount}),
    setFetchingList: (isFetching) => ({ type: actions.SET_FETCHING_LIST, isFetching }),
    resetFetchContext: () => ({type: actions.RESET_FETCH_CONTEXT}),
    removeLocalEntities: (entityIds) => ({ type: actions.REMOVE_LOCAL_ENTITIES, entityIds }),

    toggleSelectedItem: (id) => ({type: actions.TOGGLE_SELECTED_ITEM, id}),
    clearSelectedItems: () => ({type: actions.CLEAR_SELECTED_ITEMS}),

    // common crud actions
    fetchEntity: (id) => ({ type: actions.FETCH_ENTITY, id }),
    setFetchingEntity: (isFetching) => ({ type: actions.SET_FETCHING_ENTITY, isFetching }),
    setEditedEntity: (entity) => initialize(entityName, entity),
    setEditedEntityFieldValue: (field, value) => change(entityName, field, value),
    resetEditedEntity: () => reset(entityName),
    clearEditedEntity: () => initialize(entityName, null),

    saveEntity: (entity, callback = null) => ({ type: actions.SAVE_REMOTE_ENTITY, entity, callback }),
    deleteEntities: (remoteIds, callback = null) => ({ type: actions.DELETE_REMOTE_ENTITIES, remoteIds, callback }),
    restoreEntity: (entity, callback = null) => ({ type: actions.UPDATE_REMOTE_ENTITY, entity, callback })
  }
}
