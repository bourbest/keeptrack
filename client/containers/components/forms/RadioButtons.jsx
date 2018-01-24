import React from 'react'
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
  options: React.PropTypes.array.isRequired,
  input: React.PropTypes.object.isRequired,
  label: React.PropTypes.string.isRequired,
  locale: React.PropTypes.string.isRequired,
  required: React.PropTypes.bool,
  meta: React.PropTypes.object
}

RadioButtons.defaultProps = {
  direction: 'horizontal'
}

export default RadioButtons
