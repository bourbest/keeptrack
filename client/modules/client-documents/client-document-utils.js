import {isNil, forEach, map, set} from 'lodash'
import {DocumentStatus} from './config'
import {ClientLinkOptions, DocumentStatusOptions} from '../form-templates/config'
import {Schema, maxLength, date, string, boolean, required, withinRange, arrayOf, isGte, isLte, oneOf, object} from 'sapin'
import {objectId} from '../common/validate'

const getRangeValidator = (minValue, maxValue) => {
  if (!isNil(minValue) && !isNil(maxValue)) return withinRange(minValue, maxValue)
  else if (!isNil(minValue)) return isGte(minValue)
  else if (!isNil(maxValue)) return isLte(maxValue)
  return null
}

export const getValidationsForField = (field) => {
  const validations = []

  if (field.required) {
    validations.push(required)
  }

  if (field.maxLength) {
    validations.push(maxLength(field.maxLength))
  }

  if (field.choices) {
    const validChoices = map(field.choices, choice => choice.id.toString())
    validations.push(oneOf(validChoices))
  }

  switch (field.controlType) {
    case 'date':
      const minDate = !isNil(field.minValue) ? new Date(field.minValue) : null
      const maxDate = !isNil(field.maxValue) ? new Date(field.maxValue) : null
      const dateRangeValidator = getRangeValidator(minDate, maxDate)
      if (dateRangeValidator) {
        validations.push(dateRangeValidator)
      }
      return date(validations)

    case 'checkbox':
      return boolean(validations)

    case 'checkbox-list':
      return arrayOf(string(validations))

    case 'address':
      const reqString = field.required ? string(required) : string()
      return {
        civicNumber: reqString,
        streetName: reqString,
        app: string,
        city: reqString,
        postalCode: reqString
      }

    case 'table':
      return object

    default:
      const minValue = !isNil(field.minValue) ? parseFloat(field.minValue) : null
      const maxValue = !isNil(field.maxValue) ? parseFloat(field.maxValue) : null
      const rangeValidator = getRangeValidator(minValue, maxValue)
      if (rangeValidator) {
        validations.push(rangeValidator)
      }
      return string(validations)
  }
}

export const buildSchemaForFields = (fields) => {
  const schema = {}
  forEach(fields, field => {
    const validations = getValidationsForField(field)
    set(schema, field.id, validations)
  })

  return new Schema(schema)
}

export const buildSchemaForDocument = template => {
  const baseDocSchema = {
    id: objectId,
    values: buildSchemaForFields(template.fields),
    formId: objectId(required),
    status: string([required, oneOf([DocumentStatus.DRAFT, DocumentStatus.COMPLETE])]),
    createdOn: date,
    modifiedOn: date,
    documentDate: date(required),
    isArchived: boolean,
    ownerId: objectId,
    authorName: string,
    authorRole: string
  }

  if (template.clientLink === ClientLinkOptions.MANDATORY) {
    baseDocSchema.clientId = objectId(required)
  }

  return new Schema(baseDocSchema)
}

export const getDefaultValueForField = field => {
  switch (field.controlType) {
    case 'date':
      if (field.useCurrentDateAsDefaultValue) {
        return (new Date()).toString()
      } else {
        return ''
      }

    case 'checkbox':
      return false

    case 'address':
      return {
        civicNumber: '',
        streetName: '',
        app: '',
        city: '',
        postalCode: ''
      }

    case 'checkbox-list':
      return []

    case 'combobox':
    case 'input':
    case 'textarea':
    case 'rich-text':
    case 'radio-list':
    case 'title':
    case 'paragraph':
      return ''

    case 'table':
      const ret = {}
      const lineTemplate = {}
      forEach(field.columns, col => { lineTemplate[col.id] = '' })
      forEach(field.lines, line => { ret[line.id] = {...lineTemplate} })
      return ret

    default:
      throw new Error('Unexpected control type in getDefaultValueForField: ' + field.controlType)
  }
}
export const buildDocumentWithDefaultValues = (template, clientId) => {
  const newEntity = {
    clientId,
    status: template.documentStatus === DocumentStatusOptions.USE_DRAFT ? DocumentStatus.DRAFT : DocumentStatus.COMPLETE,
    formId: template.id,
    values: {},
    createdOn: new Date(),
    modifiedOn: new Date(),
    documentDate: new Date(),
    isArchived: false
  }

  forEach(template.fields, field => {
    if (field.controlType !== 'grid') {
      const value = getDefaultValueForField(field)
      set(newEntity.values, field.id, value)
    }
  })

  return newEntity
}
