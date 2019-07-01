import config from './config'
import {createSelector} from 'reselect'
import {some} from 'lodash'

const entityName = config.entityName
const Selectors = {}

Selectors.buildNewEntity = (clientId) => {
  let newEntity = {
    clientId1: clientId,
    clientId2: ''
  }
  return newEntity
}

Selectors.getSelectedClient = state => state[entityName].selectedClient
Selectors.getLinks = state => state[entityName].links
Selectors.isFetching = state => state[entityName].isFetching

Selectors.getClientId1 = (state, props) => props.params && props.params.clientId

Selectors.canCreateLink = createSelector(
  [Selectors.getLinks, Selectors.getSelectedClient, Selectors.getClientId1],
  (links, selectedClient, clientId1) => {
    return selectedClient !== null &&
    clientId1 !== selectedClient.id &&
     !some(links, link => link.clientId1 === selectedClient.id || link.clientId2 === selectedClient.id)
  }
)

Selectors.getSelectedItemIds = state => state[entityName].selectedItemIds
export default Selectors
