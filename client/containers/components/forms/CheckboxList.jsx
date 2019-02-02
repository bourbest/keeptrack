import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from './Checkbox'
import {isArray, filter} from 'lodash'

class CheckboxList extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    const newArray = isArray(this.props.value) ? [...this.props.value] : []
    const value = event.target.name

    const idx = newArray.indexOf(value)
    if (idx > -1) {
      newArray.splice(idx, 1)
    } else {
      newArray.push(value)
    }

    this.props.onChange(newArray)
  }

  render () {
    const {options, value, disabled} = this.props
    const currentValue = isArray(value) ? value : []
    const checkedValues = new Set(currentValue)

    // remove from the list archived options that are not already checked
    const validOptions = filter(options, option => !option.isArchived || checkedValues.has(option.value))
    return (
      <div>
        {validOptions.map(option => (
          <Checkbox
            key={option.value}
            name={option.value}
            value={checkedValues.has(option.value)}
            text={option.label}
            onChange={this.handleChange}
            disabled={disabled || option.isArchived}
          />)
        )}
      </div>
    )
  }
}

CheckboxList.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.array,
  disabled: PropTypes.bool
}

export default CheckboxList
