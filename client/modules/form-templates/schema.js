import {string, date, oneOf, required, Schema, validate, boolean} from 'sapin'
import {objectId} from '../common/validate'
import {ClientLinkOptions, DocumentDateOptions, DocumentStatusOptions} from './config'

export const templatePropertiesSchema = new Schema({
  id: objectId,
  isArchived: boolean,
  isSystem: boolean,
  name: string(required),
  clientLink: string([required, oneOf([ClientLinkOptions.MANDATORY, ClientLinkOptions.NO_LINK])]),
  documentDate: string([required, oneOf([DocumentDateOptions.SET_BY_USER, DocumentDateOptions.USE_CREATION_DATE])]),
  documentStatus: string([required, oneOf([DocumentStatusOptions.NO_DRAFT, DocumentStatusOptions.USE_DRAFT])]),
  documentDateLabels: {
    fr: string(required),
    en: string(required)
  },
  createOn: date,
  modifiedOn: date
})

export default (entity) => {
  return validate(entity, templatePropertiesSchema)
}
