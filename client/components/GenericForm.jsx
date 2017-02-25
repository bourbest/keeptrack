import React from 'react'
import DynamicField from './controls/DynamicField'

const { object, func, array } = React.PropTypes

const GenericForm = (props) => (
  <div>
  {
    props.fields.map((field) => (
      <DynamicField key={field.name} field={field} value={props.values[field.name]} onChange={props.onChange} />
    ))
  }
  </div>
)

GenericForm.propTypes = {
  fields: array.isRequired,
  values: object.isRequired,
  onChange: func.isRequired
}

export default GenericForm
