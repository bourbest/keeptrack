import config from './config'
import { baseInitialState, baseActionsHandler, inheritReducer } from '../common/reducers'
import { Actions } from './actions'

const initialState = {
  ...baseInitialState,
  selectedFormId: null,
  selectedTabId: 'notes'
}

const specificReducer = (state, action) => {
  switch (action.type) {
    case Actions.SET_SELECTED_FORM_ID:
      return {...state, selectedFormId: action.formId}

    case Actions.SET_SELECTED_TAB_ID:
      return {...state, selectedTabId: action.tabId}

  }
  return state
}

export default {
  [config.entityName]: inheritReducer(Actions, initialState, baseActionsHandler, specificReducer)
}
