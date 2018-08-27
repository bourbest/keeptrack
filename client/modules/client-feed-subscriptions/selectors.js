import config from './config'
import { createSelector } from 'reselect'
import {find} from 'lodash'

import {createBaseSelectors} from '../common/selectors'
import {getUser} from '../authentication/selectors'
import ClientSelectors from '../clients/selectors'
import {formatDate} from '../../services/string-utils'

const Selectors = createBaseSelectors(config.entityName)

Selectors.buildNewEntity = (userId, clientId) => {
  let newEntity = {
    userId,
    clientId,
    isArchived: false,
    fromDate: formatDate(new Date())
  }
  return newEntity
}

Selectors.getUserSubscriptiondToEditedClientFeed = createSelector(
  [Selectors.getEntities, getUser, ClientSelectors.getEditedEntity],
  (subscriptions, user, client) => {
    if (client) {
      return find(subscriptions, {userId: user.id, clientId: client.id})
    }
    return null
  }
)

export default Selectors
