import React from 'react'
import PropTypes from 'prop-types'
const Toolbar = (props) => {
  const {children} = props
  return (
    <div className="ui secondary menu crudtoolbar middle aligned content">
      {children}
    </div>
  )
}

Toolbar.propTypes = {
  children: PropTypes.any
}

export default Toolbar
