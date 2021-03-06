import React from 'react'
import PropTypes from 'prop-types'
import {omit, isNil} from 'lodash'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import {formatDate} from '../../../services/string-utils'

export default class DateInput extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleDayChanged = this.handleDayChanged.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.inputProps = {
      className: 'form-control',
      placeholder: 'AAAA-MM-JJ',
      onBlur: this.handleBlur
    }
    this.classNames = {
      container: 'd-block size-10',
      overlay: 'DayPickerInput-Overlay',
      overlayWrapper: 'DayPickerInput-OverlayWrapper'
    }
  }

  handleDayChanged (day) {
    if (day) {
      this.props.onChange(day)
      this.props.onBlur()
    }
  }

  handleBlur (event) {
    this.props.onChange(event.target.value)
    this.props.onBlur()
  }

  render () {
    const { value, ...otherProps } = this.props
    const dateProps = omit(otherProps, ['value', 'onChange'])
    const theDay = !isNil(value) && value !== '' ? new Date(value) : null

    return (
      <DayPickerInput
        onDayChange={this.handleDayChanged}
        format="YYYY-MM-DD"
        value={theDay}
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
