import config from './config'

import { createActions, createBaseActionCreators, standardActions } from '../helpers/actions'

const prefix = config.entityName.toUpperCase()

export const Actions = createActions(prefix, standardActions)
export const ActionCreators = createBaseActionCreators(Actions)
