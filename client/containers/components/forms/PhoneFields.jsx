import React from 'react'
import {bool, string, func} from 'prop-types'
import {Field} from 'redux-form'
import FormLabel from './FormLabel'
import {Checkbox, Input, FieldWrapper} from './index'
const PhoneFields = (props) => {
  return (
    <div className="form-group">
      <FormLabel required={props.required}>{props.message(props.label)}</FormLabel>
      <div className="row">
        <div className="col">
          <Field component={FieldWrapper} InputControl={Input} name="value" placeholder="555-555-5555 #12345" locale={props.locale} />
        </div>
        <div className="col">
          <Field component={FieldWrapper} InputControl={Checkbox} name="canLeaveMessage" text={props.message('canLeaveMessage')} locale={props.locale} />
        </div>
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
