import React from 'react'
import TextInput from './TextInput'
import Checkbox from './Checkbox'
import SingleChoiceList from './SingleChoiceList'
import MultipleChoiceList from './MultipleChoiceList'
import MultilineInput from './MultilineInput'
import DatePicker from 'react-datepicker'

const { object, func, string, number, bool, array, oneOfType } = React.PropTypes

const DynamicField = (props) => {
  const value = props.value
  const field = props.field
  let control = null
  switch (field.type) {
    case 'text':
    case 'password':
      control = <TextInput name={field.name} label={field.label} type={field.type} onChange={props.onChange} value={value} className={props.className} />
      break

    case 'textarea':
      control = <MultilineInput name={field.name} label={field.label} onChange={props.onChange} value={value} className={props.className} />
      break

    case 'checkbox':
      control = <Checkbox name={field.name} label={field.label} onChange={props.onChange} value={value} className={props.className} />
      break

    case 'choices':
      if (field.allowMultipleChoices) {
        control = <MultipleChoiceList name={field.name} label={field.label} choices={field.choices} onChange={props.onChange} value={value} className={props.className} />
      } else {
        control = <SingleChoiceList name={field.name} label={field.label} choices={field.choices} onChange={props.onChange} value={value} className={props.className} />
      }
      break

    case 'date':
      control = <DatePicker name={field.name} selected={value} onChange={props.onChange} />
      break

    default:
      throw new Error(`Invalid control type ${field.type}`)
  }

  return control
}

DynamicField.propTypes = {
  field: object.isRequired,
  value: oneOfType([string, number, bool, array, object]),
  onChange: func.isRequired,
  className: string
}

export default DynamicField
