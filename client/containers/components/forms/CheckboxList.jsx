import React from 'react'
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
    const value = event.target.value

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
          const key = option.id || option.value
          return (
            <div className="field" key={key}>
              <div className="ui checkbox">
                <input
                  value={option.value}
                  type="checkbox"
                  checked={checkedValues.has(option.value)}
                  onChange={this.handleChange}
                />
                <label>{option.label}</label>
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
  options: React.PropTypes.array.isRequired,
  value: React.PropTypes.array,
  label: React.PropTypes.string.isRequired,
  locale: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  isRequired: React.PropTypes.bool,
  meta: React.PropTypes.object
}

export default CheckboxList
