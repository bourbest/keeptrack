import React from 'react'
import PropTypes from 'prop-types'
const FormHeader = (props) => {
  const size = 'h' + props.headerLevel
  return React.createElement(size, {}, props.label)
}

FormHeader.propTypes = {
  headerLevel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string.isRequired
}

export default FormHeader
