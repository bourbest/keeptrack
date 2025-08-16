import config from './config'
import {createSelector} from 'reselect'
import {some} from 'lodash'

const entityName = config.entityName
const Selectors = {}

Selectors.buildNewEntity = (userId) => {
  let newEntity = {
    userId,
    clientId: ''
  }
  return newEntity
}

Selectors.getSelectedClient = state => state[entityName].selectedClient
Selectors.getBlockedFiles = state => state[entityName].blockedFiles
Selectors.isFetching = state => state[entityName].isFetching

Selectors.canCreateLink = createSelector(
  [Selectors.getBlockedFiles, Selectors.getSelectedClient],
  (blockedFiles, selectedClient) => {
    return selectedClient !== null &&
     !some(blockedFiles, blockedFile => blockedFile.clientId === selectedClient.id)
  }
)

Selectors.getSelectedItemIds = state => state[entityName].selectedItemIds
export default Selectors
