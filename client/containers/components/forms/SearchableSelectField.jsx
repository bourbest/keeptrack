import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { FieldError } from './FieldError'
import FormLabel from './FormLabel'
const { object, string, array, bool, any } = PropTypes

class SearchableSelectField extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleOnChange = this.handleOnChange.bind(this)
  }
  handleOnChange (selectedOption) {
    const newValue = selectedOption ? selectedOption.value : null
    this.props.input.onChange(newValue)
  }
  render () {
    const { input, label, locale, disabled, required, meta: { touched, error, warning } } = this.props
    const hasMsg = error || warning

    return (
      <div className="field">
        <FormLabel required={required}>{label}</FormLabel>
        {touched && hasMsg && <FieldError locale={locale} error={error} isWarning={warning} />}
        <div>
          <Select
            options={this.props.options}
            resetValue={this.props.resetValue}
            onChange={this.handleOnChange}
            value={input.value}
            name={input.name}
            disabled={disabled}
            placeholder={this.props.placeholder}
          />
        </div>
      </div>
    )
  }
}

SearchableSelectField.propTypes = {
  input: object.isRequired,
  resetValue: any,
  label: string,
  placeholder: string,
  meta: object,
  options: array.isRequired,
  locale: string.isRequired,
  required: bool
}

export default SearchableSelectField
