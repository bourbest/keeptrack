import { Schema, boolean, date, string, required, validate} from 'sapin'
import {objectId} from '../common/validate'

export const uploadedFileSchema = new Schema({
  id: objectId,
  isArchived: boolean,
  name: string(required),
  uri: string,
  clientId: objectId,
  documentDate: date,
  createdOn: date,
  modifiedOn: date
})

export default (entity, props) => {
  const errors = validate(entity, uploadedFileSchema)
  return errors
}
