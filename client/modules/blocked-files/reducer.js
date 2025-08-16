import config from './config'
import { Actions } from './actions'
import {filter, indexOf, without, concat} from 'lodash'

const initialState = {
  isFetching: false,
  blockedFiles: [],
  selectedClient: null,
  selectedItemIds: []
}

const linkReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_BLOCKED_FILES:
      return {...state, blockedFiles: action.blockedFiles}

    case Actions.SET_FETCHING:
      return {...state, isFetching: action.isFetching}

    case Actions.ADD_LOCAL_BLOCKED_FILE:
      return {...state, blockedFiles: [...state.blockedFiles, action.blockedFile]}

    case Actions.REMOVE_LOCAL_BLOCKED_FILES:
      return {...state, blockedFiles: filter(state.blockedFiles, file => action.ids.indexOf(file.id) < 0)}

    case Actions.SET_SELECTED_CLIENT:
      return {...state, selectedClient: action.client}

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
  }
  return state
}

export default {
  [config.entityName]: linkReducer
}
