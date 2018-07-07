import {isNil, forEach} from 'lodash'
import {Schema, maxLength, date, string, required, withinRange} from 'sapin'

const getValidationsForField = (field) => {
  const validations = []
  let type = string

  if (field.isRequired) {
    validations.push(required)
  }

  if (field.maxLength) {
    validations.push(maxLength(field.maxLength))
  }

  if (field.controlType === 'date') {
    type = date
  }

  if (!isNil(field.minValue) || !isNil(field.maxValue)) {
    validations.push(withinRange(field.minValue, field.maxValue))
  }

  return type(validations)
}

export const buildSchemaForFields = (fields) => {
  const schema = {}
  forEach(fields, field => {
    const validations = getValidationsForField(field)
    schema[field.id] = validations
  })
  return new Schema({values: schema})
}
