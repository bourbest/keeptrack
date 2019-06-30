import config from './config'
import {orderBy, map, filter, startsWith, forEach, indexOf} from 'lodash'
import NotificationSelectors from '../notifications/selectors'

import {createBaseSelectors} from '../common/selectors'
import { createSelector } from 'reselect'
import { EVOLUTIVE_NOTE_FORM_ID } from '../const'

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
Selectors.getFiles = state => state[config.entityName].files
Selectors.getClientFilesOrderedByDate = createSelector(
  [Selectors.getFiles],
  (files) => {
    const ret = orderBy(files, ['documentDate'], ['desc'])
    return ret
  }
)
Selectors.getSelectedFileIds = state => state[config.entityName].selectedFileIds
Selectors.getSelectedFiles = createSelector(
  [Selectors.getFiles, Selectors.getSelectedFileIds],
  (files, fileIds) => {
    return filter(files, file => indexOf(fileIds, file.id) >= 0)
  }
)
Selectors.canEditFiles = createSelector(
  [Selectors.getSelectedFileIds, Selectors.getSelectedFiles],
  (selectedIds, selectedFiles) => {
    return selectedIds.length > 0 && selectedIds.length === selectedFiles.length
  }
)

Selectors.canDeleteFiles = state => Selectors.getSelectedFileIds(state).length > 0

Selectors.getAllClientDocuments = state => state[config.entityName].clientDocuments
Selectors.getSelectedDocumentIds = state => state[config.entityName].selectedDocumentIds
Selectors.canDeleteDocuments = state => Selectors.getSelectedDocumentIds(state).length > 0

Selectors.getClientDocuments = createSelector(
  [Selectors.getAllClientDocuments],
  documents => filter(documents, document => document.formId !== EVOLUTIVE_NOTE_FORM_ID)
)

Selectors.getClientEvolutiveNotes = createSelector(
  [Selectors.getAllClientDocuments],
  documents => filter(documents, document => document.formId === EVOLUTIVE_NOTE_FORM_ID)
)

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

const prioritizeNewDocumentNotifications = notifications => {
  const ret = {}
  forEach(notifications, notf => {
    if (!ret[notf.targetId] || notf.type === 'CLIENT_DOCUMENT_CREATED' || notf.type === 'CLIENT_FILE_CREATED') {
      ret[notf.targetId] = notf
    }
  })
  return ret
}

Selectors.getNotificationsByNoteId = createSelector(
  [NotificationSelectors.getEntities],
  (notifications) => {
    const notes = filter(notifications, notf => {
      return startsWith(notf.type, 'CLIENT_DOCUMENT') && notf.formId === EVOLUTIVE_NOTE_FORM_ID
    })
    return prioritizeNewDocumentNotifications(notes)
  }
)

Selectors.getNotificationsByDocumentId = createSelector(
  [NotificationSelectors.getEntities],
  (notifications) => {
    const docs = filter(notifications, notf => {
      return startsWith(notf.type, 'CLIENT_DOCUMENT') && notf.formId !== EVOLUTIVE_NOTE_FORM_ID
    })
    return prioritizeNewDocumentNotifications(docs)
  }
)

Selectors.getNotificationsByFileId = createSelector(
  [NotificationSelectors.getEntities],
  (notifications) => {
    const docs = filter(notifications, notf => {
      return startsWith(notf.type, 'CLIENT_FILE')
    })
    return prioritizeNewDocumentNotifications(docs)
  }
)

Selectors.getNotificationsByTargetId = createSelector(
  [NotificationSelectors.getEntities],
  (notifications) => {
    const ret = {}
    forEach(notifications, notf => {
      if (!ret[notf.targetId]) {
        ret[notf.targetId] = []
      }
      ret[notf.targetId].push(notf.id)
    })
    return ret
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
