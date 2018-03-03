import React from 'react'
import PropTypes from 'prop-types'
import { FieldError } from './FieldError'
import FormLabel from './FormLabel'

const RadioButtons = (props) => {
  const { locale, label, required, options, meta: { touched, error, warning }, input } = props
  const hasMsg = error || warning

  return (
    <div className="grouped fields">
      <FormLabel required={required}>{label}</FormLabel>
      {touched && hasMsg && <FieldError locale={locale} error={error} isWarning={warning} />}
      {options.map((option) => {
        const key = option.id || option.value
        return (
          <div className="field" key={key}>
            <div className="ui radio checkbox">
              <input value={option.value} name={input.name} type="radio" checked={input.value === option.value} onChange={input.onChange} />
              <label>{option.label}</label>
            </div>
          </div>
        )
      })
      }
    </div>
  )
}

RadioButtons.propTypes = {
  options: PropTypes.array.isRequired,
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  required: PropTypes.bool,
  meta: PropTypes.object
}

RadioButtons.defaultProps = {
  direction: 'horizontal'
}

export default RadioButtons
