import React from 'react'
import PropTypes from 'prop-types'
import {filter} from 'lodash'

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

    // remove from the list archived options that are not already checked
    const validOptions = filter(options, option => !option.isArchived || value === option.id)

    return (
      <div>
        {validOptions.map((option) => {
          const key = option.id
          const checked = option.id === value ? 'checked' : ''
          return (
            <div className={'form-check'} key={key}>
              <input
                className="form-check-input"
                type="radio" tabIndex="0" checked={checked} disabled={disabled || option.isArchived}
                onChange={onChange}
                value={option.id}
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
