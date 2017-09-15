import { isArray, indexOf, keyBy, without, concat, isFunction, omit } from 'lodash'

export const baseInitialState = {
  isFetching: false,
  isListLoaded: false,
  byId: {},
  listLocalFilters: {
    contains: ''
  },
  listServerFilters: {
    contains: '',
    isArchived: false
  },
  currentActionName: null,
  selectedItemIds: [],
  sortParams: []
}

export const baseActionsHandler = (Actions, state, action) => {
  let byId
  switch (action.type) {
    case Actions.SET_LIST_LOCAL_FILTERS:
      return {...state, listLocalFilters: {...action.filters}}

    case Actions.SET_LIST_SERVER_FILTERS:
      return {...state, listServerFilters: {...action.filters}}

    case Actions.SET_FILTER_VALUE:
      const propName = action.isServer ? 'listServerFilters' : 'listLocalFilters'
      const newFilters = {...state[propName], [action.filterName]: action.value}
      return {...state, [propName]: newFilters}

    case Actions.SET_SORT_PARAMS:
      return {...state, sortParams: action.sortParams}

    case Actions.SET_FETCHING:
      const currentActionName = action.isFetching ? 'fetch' : null
      return {...state, isFetching: action.isFetching, currentActionName}

    case Actions.SET_LIST_LOADED:
      return {...state, isListLoaded: action.isLoaded}

    case Actions.SET_CURRENT_ACTION:
      return {...state, currentActionName: action.actionName}

    case Actions.SET_ENTITIES:
      const entityArray = isArray(action.entities) ? action.entities : [action.entities]
      const newEntities = keyBy(entityArray, (f) => (f.id))

      if (action.replace) {
        byId = newEntities
      } else {
        byId = {...state.byId, ...newEntities}
      }

      return {...state, byId}

    case Actions.REMOVE_LOCAL_ENTITIES:
      const serverListCount = state.serverListCount - action.entityIds.length
      byId = omit(state.byId, action.entityIds)
      return {...state, byId, serverListCount}

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
