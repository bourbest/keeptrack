import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { FieldError } from './FieldError'
import FormLabel from './FormLabel'
const { object, string, array, func, any } = PropTypes

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
    const { input, label, locale, disabled, required, isFieldRequired, meta: { touched, error, warning } } = this.props
    const hasMsg = error || warning
    const isRequired = required || (isFieldRequired && isFieldRequired(input.name))

    return (
      <div>
        <FormLabel required={isRequired}>{label}</FormLabel>
        {touched && hasMsg && <FieldError locale={locale} error={error} isWarning={warning} />}
        <div>
          <Select
            options={this.props.options}
            resetValue={this.props.resetValue}
            onChange={this.handleOnChange}
            value={this.props.input.value}
            name={this.props.name}
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
  isFieldRequired: func
}

export default SearchableSelectField
