import React from 'react'
import {bool, string, func} from 'prop-types'
import {Field} from 'redux-form'
import FormLabel from './FormLabel'
import {Select, Input, FieldWrapper} from './index'

const PhoneFields = (props) => {
  const options = [{
    id: '', text: ''
  }, {
    id: 'noMessage', label: props.message('messageOptions.noMessage')
  }, {
    id: 'nameAndPhoneOnly', label: props.message('messageOptions.nameAndPhoneOnly')
  }, {
    id: 'fullMessage', label: props.message('messageOptions.fullMessage')
  }]

  return (
    <div className="form-group">
      <div className="row">
        <div className="col">
          <FormLabel required={props.required}>{props.message(props.label)}</FormLabel>
          <Field component={FieldWrapper} InputControl={Input} name="value" placeholder="555-555-5555 #12345" locale={props.locale} />
        </div>
        <div className="col">
          <FormLabel>Message</FormLabel>
          <Field component={FieldWrapper} InputControl={Select} name="messageOption" options={options} locale={props.locale} />
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
