import config from './config'
import { Actions } from './actions'
import {filter, indexOf, without, concat} from 'lodash'

const initialState = {
  isFetching: false,
  links: [],
  selectedClient: null,
  selectedItemIds: []
}

const linkReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_LINKS:
      return {...state, links: action.links}

    case Actions.SET_FETCHING:
      return {...state, isFetching: action.isFetching}

    case Actions.ADD_LOCAL_LINK:
      return {...state, links: [...state.links, action.link]}

    case Actions.REMOVE_LOCAL_LINKS:
      return {...state, links: filter(state.links, link => action.ids.indexOf(link.id) < 0)}

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
