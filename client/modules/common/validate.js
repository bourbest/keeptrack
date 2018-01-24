import { get, set, forOwn, trim, isArray, split, slice, join, isNil } from 'lodash'

import moment from 'moment'

export const required = (value) => {
  return (value === null || trim(value) === '') ? 'commonErrors.required' : null
}

export const isNumber = (value) => {
  return (value && isNaN(Number(value))) ? 'commonErrors.invalidNumber' : null
}

export const isInteger = (value) => {
  const numberValue = Number(value)
  return (value && (isNaN(numberValue) || !Number.isInteger(numberValue))) ? 'commonErrors.invalidInteger' : null
}

export const isDate = (value) => {
  let isValid = true
  if (value && value.length > 0) {
    isValid = value.length === 25 && moment(value, moment.ISO_8601, true).isValid()
  }
  return isValid ? null : 'commonErrors.invalidDate'
}

export const isDateAfterOrEqualsToField = (propertyName, fieldLabelKey) => {
  return (dateValue, entity) => {
    let isValid = true
    const otherDate = get(entity, propertyName) || ''
    dateValue = dateValue || ''
    if (dateValue.length === 10 && otherDate.length === 10) {
      const dateValueM = moment(dateValue, 'YYYY-MM-DD', true)
      const otherDateM = moment(otherDate, 'YYYY-MM-DD', true)
      if (dateValueM.isValid() && otherDateM.isValid()) {
        isValid = dateValueM.isSameOrAfter(otherDateM)
      }
    }

    return isValid ? null : {
      error: 'commonErrors.invalidDateAfter',
      params: {otherFieldName: '$t(' + fieldLabelKey + ')'}
    }
  }
}

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
export const isEmail = (value) => {
  return (value && !emailRegex.test(value)) ? 'commonErrors.invalidEmail' : null
}

export const hasMinRows = (min) => {
  return (value) => {
    if (!value || value.length === 0) {
      return {error: 'commonErrors.notEnoughRows', params: {minRows: min}}
    }
    return null
  }
}

const isInValidValue = value => isNil(value)

export const isWithinRange = (minValue, maxValue) => {
  if (isInValidValue(minValue) && isInValidValue(maxValue)) {
    throw new Error('minValue and maxValue cannot be both null')
  }

  if (isInValidValue(minValue)) {
    return (value) => {
      return value <= maxValue ? null : {error: 'commonErrors.invalidMaxValue', params: {maxValue}}
    }
  }
  if (isInValidValue(maxValue)) {
    return (value) => {
      return value >= minValue ? null : {error: 'commonErrors.invalidMinValue', params: {minValue}}
    }
  }
  if (minValue > maxValue) {
    throw new Error('minValue cannot be greater than maxValue')
  }
  return (value) => {
    if (value === undefined || value === '' || value === null) return null
    return (value >= minValue && value <= maxValue) ? null : {error: 'commonErrors.invalidRange', params: {minValue, maxValue}}
  }
}

const validateField = (value, validations, entity) => {
  let err = null
  for (let i = 0; !err && i < validations.length; i++) {
    err = validations[i](value, entity)
  }

  return err
}

const validateEntitiesArray = (entitiesArray, validator) => {
  let errorsArray = []
  if (entitiesArray) {
    entitiesArray.forEach((entity) => {
      let errors = validateEntity(entity, validator)
      errorsArray.push(errors)
    })
  }
  return errorsArray
}

export const validateEntity = (entity, validator) => {
  const errors = {}
  forOwn(validator, (validations, fieldName) => {
    if (isArray(validations)) {
      const err = validateField(get(entity, fieldName), validations, entity)
      if (err) {
        set(errors, fieldName, err)
      }
    } else if (validations.type === 'entitiesArray') {
      const err = validateEntitiesArray(get(entity, fieldName), validations.validator)
      if (err && err.length > 0) {
        set(errors, fieldName, err)
      }
    }
  })

  return errors
}

export const isFieldRequired = (fieldPath, validator) => {
  const parts = split(fieldPath, '.')
  let simplePath = null
  for (let i = 0; i < parts.length; i++) {
    simplePath = simplePath === null ? parts[i] : simplePath + '.' + parts[i]
    if (validator[simplePath]) {
      if (isArray(validator[simplePath])) {
        return validator[simplePath].indexOf(required) !== -1
      } else if (validator[simplePath].type === 'entitiesArray' && i < parts.length - 1) {
        const restParts = slice(parts, i + 1)
        const restPath = join(restParts, '.')

        return isFieldRequired(restPath, validator[simplePath].validator)
      }
    }
  }
  return false
}

export const buildRequiredFieldsSet = (validator) => {
  let result = new Set()
  forOwn(validator, (validations, fieldName) => {
    if (isArray(validations)) {
      if (validations.indexOf(required) !== -1) {
        result.add(fieldName)
      }
    } else if (validations.type === 'entitiesArray') {
      let subresult = buildRequiredFieldsSet(validations.validator)
      let subresultArr = [...subresult]
      subresultArr = subresultArr.map((key) => fieldName + '.' + key)
      result = new Set([...result, ...subresultArr])
    }
  })
  return result
}
