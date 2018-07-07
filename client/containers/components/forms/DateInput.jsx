import React from 'react'
import PropTypes from 'prop-types'
import {omit} from 'lodash'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import {formatDate} from '../../../services/string-utils'

export default class DateInput extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleDayChanged = this.handleDayChanged.bind(this)
    this.state = {rawValue: props.value}
    this.inputProps = {
      onChange: this.handleChange,
      className: 'form-control',
      placeholder: 'AAAA-MM-JJ'
    }
    this.classNames = {
      container: 'd-block size-10',
      overlay: 'DayPickerInput-Overlay',
      overlayWrapper: 'DayPickerInput-OverlayWrapper'
    }
  }

  handleChange (event) {
    this.props.onChange(event.target.value)
    this.setState({rawValue: event.target.value})
  }

  handleDayChanged (day) {
    if (day) {
      this.setState({rawValue: day})
      this.props.onChange(day)
      this.props.onBlur()
    }
  }

  render () {
    const { value, ...otherProps } = this.props
    const dateProps = omit(otherProps, ['value', 'onChange'])
    return (
      <DayPickerInput
        onDayChange={this.handleDayChanged}
        format="YYYY-MM-DD"
        selectedDay={value}
        inputProps={this.inputProps}
        classNames={this.classNames}
        formatDate={formatDate}
        {...dateProps}
      />
    )
  }
}

DateInput.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func
}
