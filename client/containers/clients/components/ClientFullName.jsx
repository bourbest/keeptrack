import React from 'react'
import PropTypes from 'prop-types'
import {translate} from '../../../locales/translate'
const ClientFullName = (props) => {
  const {client, locale} = props
  return (
    <span>
      {translate(`clients.title.${client.gender}`, locale)} {client.firstName} {client.lastName}
    </span>
  )
}

ClientFullName.propTypes = {
  client: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
}

export default ClientFullName
