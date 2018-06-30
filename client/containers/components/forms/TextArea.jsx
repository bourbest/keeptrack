import React from 'react'
import PropTypes from 'prop-types'
import { Field as SemanticField } from '../controls/SemanticControls'
import { FieldError } from './FieldError'
import FormLabel from './FormLabel'
const { object, string, func } = PropTypes

export default class TextArea extends React.PureComponent {
  render () {
    const { input, meta, label, required, isFieldRequired, ...other } = this.props
    const isRequired = required || (isFieldRequired && isFieldRequired(input.name))
    const hasMsg = meta.error || meta.warning
    return (
      <SemanticField>
        <FormLabel required={isRequired}>{label}</FormLabel>
        {meta.touched && hasMsg && <FieldError locale={other.locale} error={meta.error} isWarning={meta.warning} />}
        <textarea {...input} ></textarea>
      </SemanticField>
    )
  }

}
TextArea.propTypes = {
  input: object.isRequired,
  label: string,
  locale: string,
  meta: object,
  isFieldRequired: func
}
