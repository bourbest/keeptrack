import {DocumentStatus} from './config'
import {Schema,  date, object, string, boolean, required, oneOf} from 'sapin'
import {objectId} from '../common/validate'

export const BaseClientDocumentSchema = new Schema({
  id: objectId,
  formId: objectId(required),
  clientId: objectId,
  status: string([required, oneOf([DocumentStatus.DRAFT, DocumentStatus.COMPLETE])]),
  createdOn: date,
  modifiedOn: date,
  isArchived: boolean,
  documentDate: date,
  values: object,
  ownerId: objectId,
  authorName: string,
  authorRole: string
})
