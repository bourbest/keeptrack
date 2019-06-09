import config from './config'
import { createActions, createBaseActionCreators, standardActions } from '../common/actions'

const prefix = config.entityName.toUpperCase()

const BaseActions = createActions(prefix, standardActions)

const SpecificActions = createActions(prefix, [
  'LOAD_CLIENT',
  'SET_SELECTED_FORM_ID',
  'SET_SELECTED_TAB_ID',
  'SET_CLIENT_DOCUMENTS',

  'FETCH_CLIENT_FORM',
  'SET_FETCHING_CLIENT_FORM',
  'SET_CLIENT_FORM',

  'SET_FILES'
])

const BaseActionCreators = createBaseActionCreators(BaseActions, config.entityName)

// override client get
BaseActionCreators.fetchEditedEntity = (clientId) => ({type: SpecificActions.LOAD_CLIENT, clientId})
const SpecificActionCreators = {
  setSelectedFormId: (formId) => ({type: SpecificActions.SET_SELECTED_FORM_ID, formId}),
  setSelectedTabId: tabId => ({type: SpecificActions.SET_SELECTED_TAB_ID, tabId}),
  setClientDocuments: documents => ({type: SpecificActions.SET_CLIENT_DOCUMENTS, documents}),

  fetchClientForm: () => ({type: SpecificActions.FETCH_CLIENT_FORM}),
  setFetchingClientForm: (isFetching) => ({type: SpecificActions.SET_FETCHING_CLIENT_FORM, isFetching}),
  setClientForm: (form) => ({type: SpecificActions.SET_CLIENT_FORM, form}),

  setFiles: (files, reset = false) => ({type: SpecificActions.SET_FILES, files, reset})
}

export const Actions = {...BaseActions, ...SpecificActions}
export const ActionCreators = {...BaseActionCreators, ...SpecificActionCreators}
