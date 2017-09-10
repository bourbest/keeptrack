import React from 'react'

const FormLabel = (props) => {
  const requiredIndicator = props.required ? <span className="required">*</span> : null
  const labelDiv = props.children ? <label>{props.children}{requiredIndicator}</label> : null
  return labelDiv
}

FormLabel.propTypes = {
  children: React.PropTypes.any,
  required: React.PropTypes.bool
}

export default FormLabel
