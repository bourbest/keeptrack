import {string, date, oneOf, required, Schema, validate, boolean} from 'sapin'
import {objectId} from '../common/validate'
import {ClientLinkOptions, DocumentDateOptions} from './config'

export const templatePropertiesSchema = new Schema({
  id: objectId,
  isArchived: boolean,
  isSystem: boolean,
  name: string(required),
  clientLink: string(oneOf([ClientLinkOptions.MANDATORY, ClientLinkOptions.NO_LINK])),
  documentDate: string(oneOf([DocumentDateOptions.SET_BY_USER, DocumentDateOptions.USE_CREATION_DATE])),
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
