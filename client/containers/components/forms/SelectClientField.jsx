import React from 'react'
import PropTypes from 'prop-types'
import {omit} from 'lodash'
import {FieldError} from './FieldError'
import FormLabel from './FormLabel'
import SelectClient from '../behavioral/SelectClient'
const {object, string, bool} = PropTypes

class SelectClientField extends React.PureComponent {
  render () {
    const { input, label, locale, meta: { touched, error, warning } } = this.props
    const hasMsg = error || warning
    const props = omit(this.props, ['input', 'meta', 'label'])
    const display = this.props.hidden ? 'none' : 'block'
    return (
      <div className="field" style={{display}}>
        <FormLabel required={input.required}>{label}</FormLabel>
        {touched && hasMsg && <FieldError locale={locale} error={error} isWarning={warning} />}
        <div>
          <SelectClient {...props} {...input} />
        </div>
      </div>
    )
  }
}

SelectClientField.propTypes = {
  input: object.isRequired,
  label: string,
  meta: object.isRequired,
  locale: string.isRequired,
  hidden: bool
}

export default SelectClientField
