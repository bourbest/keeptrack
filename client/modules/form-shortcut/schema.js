import {string, date, required, Schema, validate, boolean} from 'sapin'
import {objectId} from '../common/validate'

export const formShortcutSchema = new Schema({
  id: objectId,
  formTemplateId: objectId(required),
  labels: {
    fr: string(required),
    en: string(required)
  },
  isArchived: boolean,
  createOn: date,
  modifiedOn: date
})

export default (entity) => {
  return validate(entity, formShortcutSchema)
}
