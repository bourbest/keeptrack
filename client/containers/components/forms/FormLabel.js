import React from 'react'

const FormLabel = (props) => {
  const requiredIndicator = props.required ? <span className="required">*</span> : null
  const labelDiv = props.children ? <label htmlFor={props.for}>{props.children}{requiredIndicator}</label> : null
  return labelDiv
}

FormLabel.propTypes = {
  children: React.PropTypes.any,
  required: React.PropTypes.bool,
  for: React.PropTypes.string
}

export default FormLabel
