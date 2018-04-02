import { get } from 'lodash'

import moment from 'moment'

export const isDate = ({value}) => {
  let isValid = true
  if (value && value.length > 0) {
    isValid = value.length === 25 && moment(value, moment.ISO_8601, true).isValid()
  }
  return isValid ? null : 'commonErrors.invalidDate'
}

export const isDateAfterOrEqualsToField = (propertyName, fieldLabelKey) => {
  return ({dateValue, siblings}) => {
    let isValid = true
    const otherDate = get(siblings, propertyName) || ''
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

export const hasMinRows = (min) => {
  return ({value}) => {
    if (!value || value.length === 0) {
      return {error: 'commonErrors.notEnoughRows', params: {minRows: min}}
    }
    return null
  }
}

const PHONE_REGEX = /^\d{3}-\d{3}-\d{4}\s*((#\s*|poste\s)?\d+)?$/
export const isPhone = ({value, config}) => {
  if (config.isEmptyValue(value)) return null
  return !PHONE_REGEX.test(value) ? 'commonErrors.invalidPhone' : null
}
