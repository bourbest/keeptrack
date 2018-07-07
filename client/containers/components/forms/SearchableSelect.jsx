import React from 'react'
import PropTypes from 'prop-types'
import {omit} from 'lodash'
import Select from 'react-select'

class SearchableSelect extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleOnChange = this.handleOnChange.bind(this)
  }
  handleOnChange (selectedOption) {
    const value = selectedOption ? selectedOption.value : null
    this.props.onChange(value)
    this.props.onBlur && this.props.onBlur()
  }
  render () {
    const props = omit(this.props, ['onChange', 'onBlur'])

    return (
      <Select
        {...props}
        onChange={this.handleOnChange}
      />
    )
  }
}

SearchableSelect.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

export default SearchableSelect
