import { indexOf, keyBy, without, concat, isFunction, omit } from 'lodash'

export const baseInitialState = {
  currentPageContext: null,
  isFetchingList: false,
  isFetchingEntity: false,
  byId: {},
  totalCount: 0,
  selectedItemIds: []
}

export const baseActionsHandler = (Actions, state, action) => {
  let byId
  switch (action.type) {
    case Actions.SET_FETCHING_LIST:
      return {...state, isFetchingList: action.isFetching}

    case Actions.SET_FETCHING_ENTITY:
      return {...state, isFetchingEntity: action.isFetching}

    case Actions.SET_ENTITY_PAGE:
      return {
        ...state,
        byId: keyBy(action.entities, 'id'),
        currentPageContext: action.pageContext,
        totalCount: action.totalCount
      }

    case Actions.RESET_FETCH_CONTEXT:
      return {...state, currentPageContext: null}

    case Actions.REMOVE_LOCAL_ENTITIES:
      const totalCount = state.serverListCount - action.entityIds.length
      byId = omit(state.byId, action.entityIds)
      return {...state, byId, totalCount}

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
