import React from 'react'

const FormParagraph = (props) => {
  return (
    <div className="ql-editor" dangerouslySetInnerHTML={{__html: props.label}} />
  )
}

FormParagraph.propTypes = {
  label: React.PropTypes.string.isRequired
}

export default FormParagraph
