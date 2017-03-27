import config from './config'

import { createActions, createBaseActionCreators, standardActions } from '../helpers/actions'

const prefix = config.entityName.toUpperCase()

const BaseActions = createActions(prefix, standardActions)

const SpecificActions = createActions(prefix, [
  'SET_EDITED_FIELD'
])

const BaseActionCreators = createBaseActionCreators(BaseActions)

const SpecificActionCreators = {
  setEditedFieldName: (fieldName) => ({ type: SpecificActions.SET_EDITED_FIELD, fieldName })
}

export const Actions = {...BaseActions, ...SpecificActions}
export const ActionCreators = {...BaseActionCreators, ...SpecificActionCreators}
