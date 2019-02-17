import config from './config'
import {orderBy, map, filter, startsWith, uniqBy, keyBy} from 'lodash'
import NotificationSelectors from '../notifications/selectors'

import {createBaseSelectors} from '../common/selectors'
import { createSelector } from 'reselect'
const Selectors = createBaseSelectors(config.entityName)

Selectors.buildNewEntity = () => {
  let newEntity = {
    firstName: '',
    lastName: '',
    isArchived: false,
    gender: '',
    email: '',
    birthDate: '',
    originId: '',
    mainPhoneNumber: {
      value: '',
      messageOption: ''
    },
    alternatePhoneNumber: {
      value: '',
      messageOption: ''
    },
    address: {
      civicNumber: '',
      streetName: '',
      app: '',
      city: '',
      postalCode: ''
    },
    acceptPublipostage: false
  }
  return newEntity
}

Selectors.getClientDocuments = state => state[config.entityName].clientDocuments
Selectors.getClientEvolutiveNotes = state => state[config.entityName].clientEvolutiveNotes
Selectors.getSelectedFormId = (state) => state[config.entityName].selectedFormId
Selectors.getSelectedTabId = state => state[config.entityName].selectedTabId

Selectors.getClientDocumentsOrderByDate = createSelector(
  [Selectors.getClientDocuments],
  (documents) => {
    const ret = orderBy(documents, ['documentDate'], ['desc'])
    return ret
  }
)

Selectors.getClientNotesOrderByDate = createSelector(
  [Selectors.getClientEvolutiveNotes],
  (notes) => {
    const ret = orderBy(notes, ['documentDate'], ['desc'])
    return ret
  }
)

Selectors.getClientOptions = createSelector(
  [Selectors.getEntities],
  (clientsById) => {
    return map(clientsById, (client) => {
      return {
        label: `${client.firstName} ${client.lastName}`,
        value: client
      }
    })
  }
)

Selectors.isCreateNoteEnabled = (state) => Selectors.getSelectedItemIds(state).length === 1

Selectors.getNotificationsByNoteId = createSelector(
  [NotificationSelectors.getEntities],
  (notifications) => {
    const notes = filter(notifications, notf => {
      return startsWith(notf.type, 'EVOLUTIVE_NOTE')
    })
    return keyBy(uniqBy(notes, 'targetId'), 'targetId')
  }
)

Selectors.getNotificationsByDocumentId = createSelector(
  [NotificationSelectors.getEntities],
  (notifications) => {
    const docs = filter(notifications, notf => {
      return startsWith(notf.type, 'CLIENT_DOCUMENT')
    })
    return keyBy(uniqBy(docs, 'targetId'), 'targetId')
  }
)

Selectors.getCurrentDocumentId = (state, props) => props.params.documentId || null
Selectors.getNotificationIdsForClientDocument = createSelector(
  [NotificationSelectors.getEntities, Selectors.getCurrentDocumentId],
  (notifications, documentId) => {
    const docNotf = filter(notifications, {targetId: documentId})
    return map(docNotf, 'id')
  }
)

export default Selectors
