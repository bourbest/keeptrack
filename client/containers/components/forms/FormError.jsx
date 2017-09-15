import React from 'react'
import {translateError} from '../../../locales/translate'

export const FormError = (props) => {
  const { locale, error } = props

  if (!error) {
    return null
  }
  return <div className="error">{translateError(error, locale)}</div>
}

FormError.propTypes = {
  error: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object
  ]),
  locale: React.PropTypes.string.isRequired
}
