import { isArray, indexOf, keyBy, without, concat, isFunction } from 'lodash'

export const baseInitialState = {
  isFetching: false,
  byId: {},
  listFilterValue: '',
  editedEntity: {},
  selectedItemIds: []
}

export const baseActionsHandler = (Actions, state, action) => {
  switch (action.type) {
    case Actions.SET_LIST_FILTER:
      return {...state, listFilterValue: action.filterValue}

    case Actions.SET_FETCHING:
      return {...state, isFetching: action.isFetching}

    case Actions.SET_FETCH_ERROR:
      return {...state, isFetching: false}

    case Actions.SET_ENTITIES:
      const entityArray = isArray(action.entities) ? action.entities : [action.entities]
      const newEntities = keyBy(entityArray, (f) => (f.id))
      let byId

      if (action.replace === true) {
        byId = newEntities
      } else {
        byId = {...state.byId, ...newEntities}
      }

      return {...state, byId}

    case Actions.TOGGLE_SELECTED_ITEM:
      let selectedItemIds
      const idx = indexOf(state.selectedItemIds, action.id)
      if (idx >= 0) {
        selectedItemIds = without(state.selectedItemIds, action.id)
      } else {
        selectedItemIds = concat(state.selectedItemIds, action.id)
      }

      return {...state, selectedItemIds}

    case Actions.CLEAR_SELECTED_ITEMS:
      return {...state, selectedItemIds: []}

    case Actions.SET_EDITED_ENTITY:
      return {...state, editedEntity: {...action.entity}}

    case Actions.UPDATE_EDITED_ENTITY:
      return {...state, editedEntity: {...state.editedEntity, ...action.update}}

    case Actions.CLEAR_EDITED_ENTITY:
      return {...state, editedEntity: {}}

    default:
      return state
  }
}

export const inheritReducer = (Actions, initialState, baseReducer, overrideReducer) => {
  return (state = initialState, action = {}) => {
    if (isFunction(overrideReducer)) {
      let newState = overrideReducer(state, action)
      if (newState !== state) {
        return newState
      }
    }

    return baseReducer(Actions, state, action)
  }
}
