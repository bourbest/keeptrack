import config from './config'
import {indexOf, concat, without} from 'lodash'
import { baseInitialState, baseActionsHandler, inheritReducer } from '../common/reducers'
import { Actions } from './actions'

const initialState = {
  ...baseInitialState,
  selectedFormId: null,
  selectedTabId: 'notes',
  isFetchingClientForm: false,
  clientForm: null,
  clientDocuments: [],
  files: [],
  selectedFileIds: []
}

const specificReducer = (state, action) => {
  switch (action.type) {
    case Actions.SET_SELECTED_FORM_ID:
      return {...state, selectedFormId: action.formId}

    case Actions.SET_SELECTED_TAB_ID:
      return {...state, selectedTabId: action.tabId}

    case Actions.SET_FETCHING_CLIENT_FORM:
      return {...state, isFetchingClientForm: action.isFetching}

    case Actions.SET_CLIENT_FORM:
      return {...state, clientForm: action.form}

    case Actions.SET_CLIENT_DOCUMENTS:
      return {...state, clientDocuments: action.documents}

    case Actions.SET_FILES:
      const baseFiles = action.reset ? action.files : [...state.files, ...action.files]
      return {...state, files: baseFiles}

    case Actions.TOGGLE_SELECTED_FILE:
      let selectedFileIds
      const idx = indexOf(state.selectedFileIds, action.id)
      if (idx >= 0) {
        selectedFileIds = without(state.selectedFileIds, action.id)
      } else {
        selectedFileIds = concat(state.selectedFileIds, action.id)
      }

      return {...state, selectedFileIds}

    case Actions.CLEAR_SELECTED_FILES:
      return {...state, selectedFileIds: []}
  }
  return state
}

export default {
  [config.entityName]: inheritReducer(Actions, initialState, baseActionsHandler, specificReducer)
}
