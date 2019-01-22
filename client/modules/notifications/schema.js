import {values} from 'lodash'
import { Schema, string, boolean, date, required, oneOf } from 'sapin'
import {objectId} from '../common/validate'

export const NotificationTypes = {
  EvolutiveNoteCreated: 'EVOLUTIVE_NOTE_CREATED',
  ClientDocumentCreated: 'CLIENT_DOCUMENT_CREATED',
  ClientDocumentModified: 'CLIENT_DOCUMENT_MODIFIED',
  ClientDocumentArchived: 'CLIENT_DOCUMENT_ARCHIVED',
  ClientArchived: 'CLIENT_ARCHIVED'
}

export const notificationSchema = new Schema({
  id: objectId,
  userId: objectId(required),
  type: string(required, oneOf(values(NotificationTypes))),
  isRead: boolean,
  isArchived: boolean,
  createdOn: date,
  modifiedOn: date
})
