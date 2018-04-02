import React from 'react'
import {bool, string, func} from 'prop-types'
import {Field} from 'redux-form'
import FormLabel from './FormLabel'
import {CheckboxField, TextField} from './index'
const PhoneFields = (props) => {
  return (
    <div className="field">
      <FormLabel required={props.required}>{props.message(props.label)}</FormLabel>
      <div className="two fields">
        <div className="field">
          <Field component={TextField} name="value" placeholder="555-555-5555 #12345" locale={props.locale} />
        </div>
        <Field component={CheckboxField} name="canLeaveMessage" label={props.message('canLeaveMessage')} />
      </div>
    </div>
  )
}

PhoneFields.propTypes = {
  required: bool,
  label: string.isRequired,
  message: func.isRequired,
  locale: string.isRequired
}

export default PhoneFields
