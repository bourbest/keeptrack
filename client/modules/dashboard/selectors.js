import {values, forEach, size} from 'lodash'
import {compareStrings} from '../../services/string-utils'
import {createSelector} from 'reselect'
import {NotificationTypes} from '../notifications/schema'
import NotificationSelectors from '../notifications/selectors'
import {EVOLUTIVE_NOTE_FORM_ID} from '../const'
const Selectors = {}
Selectors.getMyClients = state => state.dashboard.clientsById
Selectors.isFetchingMyClients = state => state.dashboard.isFetchingMyClients

const sortClientsByName = (lhs, rhs) => {
  let ret = compareStrings(lhs.firstName, rhs.firstName)
  if (ret === 0) {
    ret = compareStrings(lhs.lastName, rhs.lastName)
  }
  return ret
}

Selectors.getOrderedClients = createSelector(
  [Selectors.getMyClients],
  (myClients) => {
    const clients = values(myClients)
    clients.sort(sortClientsByName)
    return clients
  })

Selectors.getClientsNotifications = createSelector(
  [NotificationSelectors.getEntities],
  (notifications) => {
    const ret = {}
    forEach(notifications, notf => {
      if (!ret[notf.clientId]) {
        ret[notf.clientId] = {new: {}, updated: {}, notes: {}}
      }
      if (notf.type === NotificationTypes.ClientDocumentCreated) {
        ret[notf.clientId].new[notf.targetId] = 1
      } else if (notf.type === NotificationTypes.ClientDocumentModified) {
        if (notf.formId === EVOLUTIVE_NOTE_FORM_ID) {
          ret[notf.clientId].notes[notf.targetId] = 1
        } else {
          ret[notf.clientId].updated[notf.targetId] = 1
        }
      }
    })
    forEach(ret, client => {
      client.notes = size(client.notes)
      client.new = size(client.new)
      client.updated = size(client.updated)
    })

    return ret
  }
)

export default Selectors
