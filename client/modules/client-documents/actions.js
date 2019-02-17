import config from './config'
import {createActions} from '../common/actions'
import {initialize} from 'redux-form'

const prefix = config.entityName.toUpperCase()

export const Actions = createActions(prefix, [
  'LOAD_DOCUMENT',
  'INITIALIZE_NEW_DOCUMENT',
  'RESET_FORM',
  'SAVE_DOCUMENT',
  'SET_CLIENT',
  'SET_FETCHING_ENTITY',
  'SET_TEMPLATE'
])

export const ActionCreators = {
  loadDocument: (documentId) => ({type: Actions.LOAD_DOCUMENT, documentId}),
  initializeNewDocument: (formTemplateId, clientId) => ({type: Actions.INITIALIZE_NEW_DOCUMENT, formTemplateId, clientId}),
  resetForm: () => ({type: Actions.RESET_FORM}),
  save: (entity, callback = null) => ({ type: Actions.SAVE_DOCUMENT, entity, callback }),
  setClient: (client) => ({type: Actions.SET_CLIENT, client}),
  setFetchingEntity: isFetching => ({type: Actions.SET_FETCHING_ENTITY, isFetching}),
  setTemplate: template => ({type: Actions.SET_TEMPLATE, template}),

  setEditedEntity: (entity) => initialize(config.entityName, entity)
}
