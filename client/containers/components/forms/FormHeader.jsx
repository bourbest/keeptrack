import React from 'react'
import {Header} from 'semantic-ui-react'
const PropTypes = React.PropTypes
const FormHeader = (props) => {
  const size = 'h' + props.headerLevel
  return (
    <Header as={size}>
      {props.label}
    </Header>
  )
}

FormHeader.propTypes = {
  headerLevel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string.isRequired
}

export default FormHeader
