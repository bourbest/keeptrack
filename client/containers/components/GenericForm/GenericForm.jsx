import React from 'react'
import PropTypes from 'prop-types'
import DynamicField from './DynamicField'

const { object, func, array } = PropTypes

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
