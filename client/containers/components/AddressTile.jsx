import React from 'react'
import PropTypes from 'prop-types'

const AddressTile = (props) => {
  const {civicNumber, streetName, app, city, postalCode} = props.address
  const hasApp = app && app.length > 0
  const postal = postalCode && postalCode.length > 0 ? ', ' + postalCode : ''
  return (
    <div>
      <span>
        {civicNumber} {streetName} {hasApp && <span>, app. {app}</span>}
      </span>
      <br />
      {city}{postal}
    </div>
  )
}

AddressTile.propTypes = {
  address: PropTypes.object.isRequired
}

export default AddressTile
