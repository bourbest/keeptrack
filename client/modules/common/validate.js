import { identity } from 'lodash'
import {isEmptyValue, PropertyDefinition, ValueTypes, isOfTypeString} from 'sapin'

export const hasMinRows = (min) => {
  return ({value}) => {
    if (!value || value.length === 0) {
      return {error: 'commonErrors.notEnoughRows', params: {minRows: min}}
    }
    return null
  }
}

const PHONE_REGEX = /^\d{3}-\d{3}-\d{4}\s*((#\s*|poste\s)?\d+)?$/
export const isPhone = ({value}) => {
  if (isEmptyValue(value)) return null
  return !PHONE_REGEX.test(value) ? 'commonErrors.invalidPhone' : null
}

// valueType, getter, validators = [], typeValidator = null, transform = null, collectionValidator = null
let transformObjectId = identity
if (process.env.target === 'server') {
  const ObjectId = require('mongodb').ObjectId

  transformObjectId = (value) => {
    if (value) return ObjectId(value)
    return null
  }
}

export const objectId = (validators) => {
  return new PropertyDefinition(ValueTypes.value, identity, validators, isOfTypeString, transformObjectId)
}
