import config from './config'
import { createActions, createBaseActionCreators, standardActions } from '../common/actions'

const prefix = config.entityName.toUpperCase()

const BaseActions = createActions(prefix, standardActions)

const specificActions = createActions(prefix, [
  'ADD_LOCAL_ENTITIES'
])

const specificActionCreators = {
  addLocalEntities: (entities) => ({type: specificActions.ADD_LOCAL_ENTITIES, entities})
}

const BaseActionCreators = createBaseActionCreators(BaseActions, config.entityName)

export const Actions = {...BaseActions, ...specificActions}
export const ActionCreators = {...BaseActionCreators, ...specificActionCreators}
