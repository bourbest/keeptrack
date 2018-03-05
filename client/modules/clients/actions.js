import config from './config'
import { createActions, createBaseActionCreators, standardActions } from '../common/actions'

const prefix = config.entityName.toUpperCase()

const BaseActions = createActions(prefix, standardActions)

const SpecificActions = createActions(prefix, [
  'LOAD_CLIENT',
  'SET_SELECTED_FORM_ID'
])

const BaseActionCreators = createBaseActionCreators(BaseActions, config.entityName)

// override client get
BaseActionCreators.fetchEditedEntity = (clientId) => ({type: SpecificActions.LOAD_CLIENT, clientId})
const SpecificActionCreators = {
  setSelectedFormId: (formId) => ({type: SpecificActions.SET_SELECTED_FORM_ID, formId})
}

export const Actions = {...BaseActions, ...SpecificActions}
export const ActionCreators = {...BaseActionCreators, ...SpecificActionCreators}
