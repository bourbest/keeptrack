import React from 'react'
import PropTypes from 'prop-types'
import { FieldError } from './FieldError'
import FormLabel from './FormLabel'
import {isArray} from 'lodash'

class CheckboxList extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    const input = this.props.input
    const newArray = isArray(input.value) ? [...input.value] : []
    const value = event.target.previousSibling.value

    const idx = newArray.indexOf(value)
    if (idx > -1) {
      newArray.splice(idx, 1)
    } else {
      newArray.push(value)
    }

    input.onChange(newArray)
  }

  render () {
    const {locale, label, isRequired, options, meta: {touched, error, warning}, input} = this.props
    const value = isArray(input.value) ? input.value : []
    const hasMsg = error || warning
    const checkedValues = new Set(value || [])

    return (
      <div className="grouped fields">
        <FormLabel required={isRequired}>{label}</FormLabel>
        {touched && hasMsg && <FieldError locale={locale} error={error} isWarning={warning} />}
        {options.map((option) => {
          const checked = checkedValues.has(option.value) ? 'checked' : ''
          return (
            <div className="inline field" key={option.value}>
              <div className={`ui checkbox ${checked}`}>
                <input type="checkbox" tabIndex="0" className="hidden" checked={checkedValues.has(option.value)} value={option.value} />
                <label onClick={this.handleChange}>{option.label}</label>
              </div>
            </div>
          )
        })
        }
      </div>
    )
  }
}

CheckboxList.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.array,
  label: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  meta: PropTypes.object
}

export default CheckboxList
