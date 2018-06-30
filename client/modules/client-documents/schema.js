import { Schema, required, date, boolean } from 'sapin'
import {objectId} from '../common/validate'
export const clientDocumentSchema = new Schema({
  id: objectId,
  clientId: objectId(required),
  formId: objectId(required),
  createdOn: date,
  modifiedOn: date,
  isArchived: boolean
})
