import config from './config'
import {orderBy, map, filter, startsWith, uniqBy, keyBy} from 'lodash'
import { getLocale } from '../app/selectors'
import NotificationSelectors from '../notifications/selectors'

import {
  createBaseSelectors, buildSortedOptionList, EMPTY_ARRAY
} from '../common/selectors'
import { createSelector } from 'reselect'
const Selectors = createBaseSelectors(config.entityName)

const genders = [
  {en: 'Male', fr: 'Homme', id: 'M'},
  {en: 'Female', fr: 'Femme', id: 'F'}
]

Selectors.getGenderOptionList = createSelector(
  [getLocale],
  (locale) => {
    return buildSortedOptionList(genders, locale)
  }
)

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

Selectors.getSelectedFormId = (state) => state[config.entityName].selectedFormId
Selectors.getSelectedTabId = state => state[config.entityName].selectedTabId

Selectors.getClientDocumentsOrderByDate = createSelector(
  [Selectors.getEditedEntity],
  (client) => {
    if (!client) return EMPTY_ARRAY
    const ret = orderBy(client.documents, ['createdOn'], ['desc'])
    return ret
  }
)

Selectors.getClientNotesOrderByDate = createSelector(
  [Selectors.getEditedEntity],
  (client) => {
    if (!client || !client.evolutionNotes) return EMPTY_ARRAY
    const ret = orderBy(client.evolutionNotes, ['exchangeDate'], ['desc'])
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
