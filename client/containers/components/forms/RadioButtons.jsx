import React from 'react'
import FormLabel from './FormLabel'
import { Field } from 'redux-form'

const RadioButtons = (props) => {
  const { label, name, required, options, direction } = props
  const directionClass = direction === 'horizontal' ? 'inline fields' : 'grouped fields'
  return (
    <div className={directionClass} >
      <FormLabel for={name} required={required}>{label}</FormLabel>
      <div className="field">
        {options.map((option) => (
          <div key={option.value} className="ui radio checkbox">
            <Field value={option.value} name={name} component="input" type="radio" />
            <label>{option.label}</label>
          </div>
         ))
        }
      </div>
    </div>
  )
}

RadioButtons.propTypes = {
  options: React.PropTypes.array.isRequired,
  direction: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  locale: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  required: React.PropTypes.bool
}

RadioButtons.defaultProps = {
  direction: 'horizontal'
}

export default RadioButtons
