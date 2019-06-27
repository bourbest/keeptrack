import {Schema, boolean, date, string, required, arrayOf, validate} from 'sapin'
import {objectId} from '../common/validate'

export const uploadedFileSchema = new Schema({
  id: objectId,
  isArchived: boolean,
  name: string(required),
  uri: string,
  clientId: objectId,
  documentDate: date(required),
  createdOn: date,
  modifiedOn: date,
  ownerId: objectId,
  authorName: string,
  authorRole: string
})

const formSchema = new Schema({
  files: arrayOf(uploadedFileSchema)
})

export const validateReviewFilesForm = (entity, props) => {
  const errors = validate(entity, formSchema)
  return errors
}

export default (entity, props) => {
  const errors = validate(entity, uploadedFileSchema)
  return errors
}
