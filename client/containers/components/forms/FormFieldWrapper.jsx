import PropTypes from 'prop-types'
import React from 'react'
const { object, string } = PropTypes
import { FieldError } from './FieldError'
import FormLabel from './FormLabel'
class FormFieldWrapper extends React.PureComponent {
  render () {
    const { input, InputControl, locale, meta: { touched, error, warning }, required, label, ...otherProps } = this.props
    const hasMsg = error || warning
    return (
      <div className="form-group">
        {label && <FormLabel required={required}>{label}</FormLabel>}
        <InputControl {...input} {...otherProps} locale={locale} />
        {touched && hasMsg && <FieldError locale={locale} error={error} isWarning={warning} />}
      </div>
    )
  }
}

FormFieldWrapper.propTypes = {
  input: object.isRequired,
  InputControl: PropTypes.any,
  label: PropTypes.string,
  required: PropTypes.bool,
  meta: object.isRequired,
  locale: string.isRequired
}

export default FormFieldWrapper
