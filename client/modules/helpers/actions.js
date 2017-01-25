import { forEach } from 'lodash'

export const standardActions = [
  'SET_LIST_FILTER',

  'FETCH_ALL',
  'SET_FETCHING',
  'SET_FETCH_ERROR',
  'SET_ENTITIES',

  'TOGGLE_SELECTED_ITEM',
  'CLEAR_SELECTED_ITEMS',

  'FETCH_EDITED_ENTITY',
  'SET_EDITED_ENTITY',
  'UPDATE_EDITED_ENTITY',
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

export const createBaseActionCreators = (actions) => {
  return {
    setListFilter: (filterValue) => ({ type: actions.SET_LIST_FILTER, filterValue }),

    fetchAll: () => ({ type: actions.FETCH_ALL }),
    setFetching: (isFetching) => ({ type: actions.SET_FETCHING, isFetching }),
    setFetchError: (error) => ({ type: actions.SET_FETCH_ERROR, error }),
    setEntities: (entities, replace) => ({ type: actions.SET_ENTITIES, entities, replace }),

    toggleSelectedItem: (id) => ({type: actions.TOGGLE_SELECTED_ITEM, id}),
    clearSelectedItems: () => ({type: actions.CLEAR_SELECTED_ITEMS}),

    fetchEditedEntity: (id) => ({ type: actions.FETCH_EDITED_ENTITY, id }),
    setEditedEntity: (entity) => ({ type: actions.SET_EDITED_ENTITY, entity }),
    updateEditedEntity: (update) => ({ type: actions.UPDATE_EDITED_ENTITY, update }),
    clearEditedEntity: () => ({ type: actions.CLEAR_EDITED_ENTITY }),

    createEntity: (entity, callback = null) => ({ type: actions.CREATE_REMOTE_ENTITY, entity, callback }),
    updateEntity: (entity, callback = null) => ({ type: actions.UPDATE_REMOTE_ENTITY, entity, callback }),
    deleteEntities: (remoteIds, callback = null) => ({ type: actions.DELETE_REMOTE_ENTITIES, remoteIds, callback })
  }
}
