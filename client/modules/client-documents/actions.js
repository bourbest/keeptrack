import config from './config'
import {createActions} from '../common/actions'
import {initialize} from 'redux-form'

const prefix = config.entityName.toUpperCase()

export const Actions = createActions(prefix, [
  'LOAD_DOCUMENT',
  'SAVE_DOCUMENT'
])

export const ActionCreators = {
  loadDocument: (clientId, documentId) => ({type: Actions.LOAD_DOCUMENT, clientId, documentId}),
  setEditedEntity: (entity) => initialize(config.entityName, entity),

  save: (entity, callback = null) => ({ type: Actions.SAVE_DOCUMENT, entity, callback })
}
