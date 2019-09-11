import React from 'react'
import PropTypes from 'prop-types'
const ClientFullName = (props) => {
  const {client} = props
  return (
    <span>
      {client.firstName} {client.lastName} ({client.clientType})
    </span>
  )
}

ClientFullName.propTypes = {
  client: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
}

export default ClientFullName
