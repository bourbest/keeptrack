import React from 'react'
import PropTypes from 'prop-types'

const FormLabel = (props) => {
  const requiredIndicator = props.required ? <span className="required">*</span> : null
  const labelDiv = props.children ? <label htmlFor={props.for}>{props.children}{requiredIndicator}</label> : null
  return labelDiv
}

FormLabel.propTypes = {
  children: PropTypes.any,
  required: PropTypes.bool,
  for: PropTypes.string
}

export default FormLabel
