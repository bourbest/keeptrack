import React from 'react'
import PropTypes from 'prop-types'

class Checkbox extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    event.target.previousSibling.click()
  }

  render () {
    const { text, value, disabled, className, onChange, name } = this.props
    let checked = value === true
    return (
      <div className={'form-check ' + (className || '')}>
        <input
          className="form-check-input"
          type="checkbox" tabIndex="0"
          checked={checked} disabled={disabled}
          onChange={onChange}
          name={name}
        />
        <label className="form-check-label" onClick={this.handleChange}>
          {text}
        </label>
      </div>
    )
  }
}

Checkbox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  name: PropTypes.string,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string
}

export default Checkbox
