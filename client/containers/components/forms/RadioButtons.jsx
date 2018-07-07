import React from 'react'
import PropTypes from 'prop-types'

class RadioButtons extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    event.target.previousSibling.click()
  }

  render () {
    const {value, options, disabled, onChange, name} = this.props

    return (
      <div>
        {options.map((option) => {
          const key = option.value
          const checked = option.value === value ? 'checked' : ''
          return (
            <div className={'form-check'} key={key}>
              <input
                className="form-check-input"
                type="radio" tabIndex="0" checked={checked} disabled={disabled}
                onChange={onChange}
                value={option.value}
                name={name}
              />
              <label className="form-check-label" onClick={this.handleChange}>
                {option.label}
              </label>
            </div>
          )
        })
        }
      </div>
    )
  }
}

RadioButtons.propTypes = {
  options: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.string
}

export default RadioButtons
