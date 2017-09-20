import React from 'react'

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
      <div className="ui right icon input search-input">
        {value.length === 0 && <i className="search icon"></i>}
        <input type='text' placeholder={placeholder}
          value={value}
          onChange={this.handleValueChanged} />
        {value.length > 0 && <i className="remove link icon" onClick={this.handleResetValue}></i>}
      </div>
    )
  }
}

SearchBox.propTypes = {
  value: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string.isRequired
}

SearchBox.defaultProps = {
  placeholder: ''
}

export default SearchBox