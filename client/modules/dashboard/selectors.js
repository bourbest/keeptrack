import {values, forEach, size, sortBy, keys, omit} from 'lodash'
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
        ret[notf.clientId] = {newDocuments: {}, updatedDocuments: {}, newNotes: {}, updatedNotes: {}, newLinks: {}}
      }
      if (notf.type === NotificationTypes.ClientDocumentCreated || notf.type === NotificationTypes.ClientFileCreated) {
        if (notf.formId === EVOLUTIVE_NOTE_FORM_ID) {
          ret[notf.clientId].newNotes[notf.targetId] = 1
        } else {
          ret[notf.clientId].newDocuments[notf.targetId] = 1
        }
      } else if (notf.type === NotificationTypes.ClientDocumentModified) {
        if (notf.formId === EVOLUTIVE_NOTE_FORM_ID) {
          ret[notf.clientId].updatedNotes[notf.targetId] = 1
        } else {
          ret[notf.clientId].updatedDocuments[notf.targetId] = 1
        }
      } else if (notf.type === NotificationTypes.ClientLinkCreated) {
        ret[notf.clientId].newLinks[notf.targetId] = 1
      }
    })
    forEach(ret, client => {
      client.updatedNotes = size(omit(client.updatedNotes, keys(client.newNotes)))
      client.newNotes = size(client.newNotes)
      client.updatedDocuments = size(omit(client.updatedDocuments, keys(client.newDocuments)))
      client.newDocuments = size(client.newDocuments)
      client.newLinks = size(client.newLinks)
    })

    return ret
  }
)

Selectors.getIncompleteDocumentsById = state => state['dashboard'].incompleteDocumentsById

Selectors.getSortedIncompleteDocuments = createSelector(
  [Selectors.getIncompleteDocumentsById],
  (docsById) => {
    return sortBy(docsById, 'createdOn')
  }
)

export default Selectors
