import React from 'react'
import PropTypes from 'prop-types'
import {translateError} from '../../../locales/translate'

export const FieldError = (props) => {
  const { locale, isWarning, error } = props
  if (!error) {
    return null
  }
  return <div className={isWarning ? 'warning' : 'error'}>{translateError(error, locale)}</div>
}

FieldError.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  isWarning: PropTypes.bool,
  locale: PropTypes.string
}
