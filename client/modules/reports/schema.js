import {date, required, Schema, validate, isGteToField, boolean} from 'sapin'
import {objectId} from '../common/validate'

export const reportParametersSchema = new Schema({
  formTemplateId: objectId(required),
  fromDate: date(required),
  toDate: date([required, isGteToField('fromDate', 'generateReport.fromDate')]),
  excludeIncompleteDocuments: boolean
})

export const validateFormParams = (entity) => {
  return validate(entity, reportParametersSchema)
}
