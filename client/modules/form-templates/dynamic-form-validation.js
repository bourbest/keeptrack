import {isNil, forEach} from 'lodash'
import {Schema, maxLength, date, string, boolean, required, withinRange, arrayOf, isGte, isLte} from 'sapin'

const getRangeValidator = (minValue, maxValue) => {
  if (!isNil(minValue) && !isNil(maxValue)) return withinRange(minValue, maxValue)
  else if (!isNil(minValue)) return isGte(minValue)
  else if (!isNil(maxValue)) return isLte(maxValue)
  return null
}

const getValidationsForField = (field) => {
  const validations = []

  if (field.isRequired) {
    validations.push(required)
  }

  if (field.maxLength) {
    validations.push(maxLength(field.maxLength))
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
  return new Schema({values: schema})
}
