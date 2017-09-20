import config from './config'
import { createActions, createBaseActionCreators, standardActions } from '../common/actions'

const prefix = config.entityName.toUpperCase()

const BaseActions = createActions(prefix, standardActions)

const SpecificActions = createActions(prefix, [
])

const BaseActionCreators = createBaseActionCreators(BaseActions, config.entityName)

const SpecificActionCreators = {
}

export const Actions = {...BaseActions, ...SpecificActions}
export const ActionCreators = {...BaseActionCreators, ...SpecificActionCreators}
