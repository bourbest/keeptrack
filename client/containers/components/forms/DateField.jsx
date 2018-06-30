import React from 'react'
import PropTypes from 'prop-types'
import FormLabel from './FormLabel'
const { object, string, func } = PropTypes
import { FieldError } from './FieldError'
import moment from 'moment'
import { Field as SemanticField } from '../controls/SemanticControls'
import DatePicker from 'react-datepicker'

export default class DateField extends React.PureComponent {

  constructor (props) {
    super(props)
    this.onDateChange = this.onDateChange.bind(this)
    this.onRawChange = this.onRawChange.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.state = {
      raw: props.value
    }
  }

  onDateChange (newDate) {
    const raw = newDate ? newDate.format() : this.state.raw
    this.setState({raw})
    this.props.input.onChange(raw)
  }

  onRawChange (event) {
    this.setState({raw: event.target.value})
  }

  onBlur () {
    this.props.input.onChange(this.state.raw)
  }

  render () {
    const { label, input: {name, value}, locale, required, isFieldRequired, meta: {error, warning} } = this.props
    const hasMsg = error || warning
    const isRequired = required || (isFieldRequired && isFieldRequired(name))
    const date = moment(value, moment.ISO_8601, true)
    return (
      <SemanticField>
        <FormLabel required={isRequired}>{label}</FormLabel>
        {hasMsg && <FieldError locale={locale} error={error} isWarning={warning} />}
        <DatePicker
          selected={date.isValid() ? date : null}
          dateFormat="YYYY-MM-DD"
          onBlur={this.onBlur}
          onChangeRaw={this.onRawChange}
          onChange={this.onDateChange}
          locale={locale}
        />
      </SemanticField>
    )
  }
}

DateField.propTypes = {
  input: object.isRequired,
  label: string,
  locale: string,
  meta: object,
  isFieldRequired: func
}
