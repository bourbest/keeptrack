import React from 'react'
import PropTypes from 'prop-types'
const { object, string, bool, func } = PropTypes
import { Field as SemanticField } from '../controls/SemanticControls'
import { FieldError } from './FieldError'
import FormLabel from './FormLabel'

const TextField = ({ input, label, type, placeholder, locale, disabled, required, isFieldRequired, meta: { touched, error, warning } }) => {
  const hasMsg = error || warning
  const isRequired = required || (isFieldRequired && isFieldRequired(input.name))
  const textFieldProps = {...input, disabled, placeholder}
  return (
    <SemanticField>
      <FormLabel required={isRequired}>{label}</FormLabel>
      {touched && hasMsg && <FieldError locale={locale} error={error} isWarning={warning} />}
      <input {...textFieldProps} type={type} autoComplete="off" />
    </SemanticField>
  )
}

TextField.propTypes = {
  input: object.isRequired,
  label: string,
  meta: object,
  locale: string.isRequired,
  type: string.isRequired,
  disabled: bool,
  required: bool,
  placeholder: string,
  isFieldRequired: func
}

TextField.defaultProps = {
  type: 'text'
}

export default TextField
