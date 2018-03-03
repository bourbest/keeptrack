import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

const BackButton = (props) => {
  const {backTo} = props
  return <Link to={backTo} className="item back-button"><i className="big left arrow circle outline icon"></i></Link>
}

BackButton.propTypes = {
  backTo: PropTypes.string
}

export default BackButton
