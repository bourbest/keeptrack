import React from 'react'
import PropTypes from 'prop-types'
import { Form, Rating } from 'semantic-ui-react'
import { FieldError } from './FieldError'
import FormLabel from './FormLabel'

const SemanticField = Form.Field

const RatingField = ({ input, label, maxValue, locale, disabled, required, meta: { touched, error, warning } }) => {
  const hasMsg = error || warning
  return (
    <SemanticField>
      <FormLabel required={required}>{label}</FormLabel>
      {touched && hasMsg && <FieldError locale={locale} error={error} isWarning={warning} />}
      <Rating
        icon="star"
        defaultRating={0}
        maxRating={maxValue}
        disabled={disabled}
        value={input.value}
      />
    </SemanticField>
  )
}

RatingField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  meta: PropTypes.object,
  locale: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  maxValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

export default RatingField
