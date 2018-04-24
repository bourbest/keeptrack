import React from 'react'
import PropTypes from 'prop-types'
import { FieldError } from './FieldError'
import FormLabel from './FormLabel'

class RadioButtons extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    const input = this.props.input
    const value = event.target.previousSibling.value

    input.onChange(value)
  }

  render () {
    const {locale, label, required, options, meta: {touched, error, warning}, input} = this.props
    const hasMsg = error || warning

    return (
      <div className="grouped fields">
        <FormLabel required={required}>{label}</FormLabel>
        {touched && hasMsg && <FieldError locale={locale} error={error} isWarning={warning} />}
        {options.map((option) => {
          const key = option.value
          const checked = option.value === input.value ? 'checked' : ''
          return (
            <div className="field" key={key}>
              <div className={`ui radio checkbox ${checked}`}>
                <input type="radio" value={option.value} name={input.name} checked={input.value === option.value} readOnly className="hidden" tabIndex="0" />
                <label onClick={this.handleChange}>{option.label}</label>
              </div>
            </div>
          )
        })
        }
      </div>
    )
  }
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
