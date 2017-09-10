import React from 'react'
import {translateError} from '../../../locales/translate'

export const FieldError = (props) => {
  const { locale, isWarning, error } = props
  if (!error) {
    return null
  }
  return <div className={isWarning ? 'warning' : 'error'}>{translateError(error, locale)}</div>
}

FieldError.propTypes = {
  error: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object
  ]),
  isWarning: React.PropTypes.bool,
  locale: React.PropTypes.string
}
