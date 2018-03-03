import React from 'react'
import PropTypes from 'prop-types'
const FormParagraph = (props) => {
  return (
    <div className="ql-editor" dangerouslySetInnerHTML={{__html: props.label}} />
  )
}

FormParagraph.propTypes = {
  label: PropTypes.string.isRequired
}

export default FormParagraph
