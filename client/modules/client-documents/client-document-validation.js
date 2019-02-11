import {isNil, forEach, map} from 'lodash'
import {DocumentStatus} from './config'
import {ClientLinkOptions} from '../form-templates/config'
import {Schema, maxLength, date, string, boolean, required, withinRange, arrayOf, isGte, isLte, oneOf} from 'sapin'
import {objectId} from '../common/validate'

const getRangeValidator = (minValue, maxValue) => {
  if (!isNil(minValue) && !isNil(maxValue)) return withinRange(minValue, maxValue)
  else if (!isNil(minValue)) return isGte(minValue)
  else if (!isNil(maxValue)) return isLte(maxValue)
  return null
}

const getValidationsForField = (field) => {
  const validations = []

  if (field.required) {
    validations.push(required)
  }

  if (field.maxLength) {
    validations.push(maxLength(field.maxLength))
  }

  if (field.choices) {
    const validChoices = map(field.choices, 'value')
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
    schema[field.id] = validations
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
    isArchived: boolean
  }

  if (template.clientLink === ClientLinkOptions.MANDATORY) {
    baseDocSchema.clientId = objectId(required)
  }

  return new Schema(baseDocSchema)
}
