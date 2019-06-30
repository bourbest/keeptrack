import config from './config'
import {indexOf, concat, without, filter} from 'lodash'
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
  selectedFileIds: [],
  selectedDocumentIds: []
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

    case Actions.REMOVE_LOCAL_DOCUMENTS:
      return {...state,
        clientDocuments: filter(state.clientDocuments, doc => action.documentIds.indexOf(doc.id) < 0)
      }

    case Actions.SET_FILES:
      const baseFiles = action.reset ? action.files : [...state.files, ...action.files]
      return {...state, files: baseFiles}

    case Actions.REMOVE_LOCAL_FILES:
      return {...state,
        files: filter(state.files, file => action.fileIds.indexOf(file.id) < 0)
      }

    case Actions.TOGGLE_SELECTED_ITEM:
      let selectedIds = state[action.itemType]
      const idx = indexOf(selectedIds, action.id)
      if (idx >= 0) {
        selectedIds = without(selectedIds, action.id)
      } else {
        selectedIds = concat(selectedIds, action.id)
      }

      return {...state, [action.itemType]: selectedIds}

    case Actions.CLEAR_SELECTED_FILES:
      return {...state, [action.itemType]: []}
  }
  return state
}

export default {
  [config.entityName]: inheritReducer(Actions, initialState, baseActionsHandler, specificReducer)
}
