import {values} from 'lodash'
import { Schema, string, boolean, date, required, validate, oneOf } from 'sapin'
import {objectId} from '../common/validate'

export const NotificationTypes = {
  EvolutiveNoteCreated: 'EVOLUTIVE_NOTE_CREATED',
  ClientDocumentCreated: 'CLIENT_DOCUMENT_CREATED',
  ClientDocumentModified: 'CLIENT_DOCUMENT_MODIFIED',
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
