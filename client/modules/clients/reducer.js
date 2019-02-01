import config from './config'
import { baseInitialState, baseActionsHandler, inheritReducer } from '../common/reducers'
import { Actions } from './actions'

const initialState = {
  ...baseInitialState,
  selectedFormId: null,
  selectedTabId: 'notes',
  isFetchingClientForm: false,
  clientForm: null
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
  }
  return state
}

export default {
  [config.entityName]: inheritReducer(Actions, initialState, baseActionsHandler, specificReducer)
}
