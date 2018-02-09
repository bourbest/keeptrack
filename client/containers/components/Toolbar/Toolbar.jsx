import React from 'react'

const Toolbar = (props) => {
  const {children} = props
  return (
    <div className="ui secondary menu crudtoolbar middle aligned content">
      {children}
    </div>
  )
}

Toolbar.propTypes = {
  children: React.PropTypes.any
}

export default Toolbar
