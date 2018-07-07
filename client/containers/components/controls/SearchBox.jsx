import React from 'react'
import PropTypes from 'prop-types'
import {Icon} from '../controls/SemanticControls'
class SearchBox extends React.Component {
  constructor (props) {
    super(props)
    this.handleResetValue = this.handleResetValue.bind(this)
    this.handleValueChanged = this.handleValueChanged.bind(this)
  }

  handleValueChanged (event) {
    this.props.onChange(event.target.value)
  }

  handleResetValue () {
    this.props.onChange('')
  }

  render () {
    const {value, placeholder} = this.props
    return (
      <div className="input-group">
        <input
          type='text' placeholder={placeholder}
          className="form-control py-2 border-right-0 border"
          value={value}
          onChange={this.handleValueChanged}
        />
        <span className="input-group-append">
          <div className="input-group-text bg-transparent">
            {value.length === 0 && <Icon name="search" />}
            {value.length > 0 && <Icon name="cancel" onClick={this.handleResetValue} />}
          </div>
        </span>
      </div>
    )
  }
}

SearchBox.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired
}

SearchBox.defaultProps = {
  placeholder: ''
}

export default SearchBox
