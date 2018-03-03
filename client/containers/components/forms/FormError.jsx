import React from 'react'
import PropTypes from 'prop-types'
import {translateError} from '../../../locales/translate'

export const FormError = (props) => {
  const { locale, error } = props

  if (!error) {
    return null
  }
  return <div className="error">{translateError(error, locale)}</div>
}

FormError.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  locale: PropTypes.string.isRequired
}
