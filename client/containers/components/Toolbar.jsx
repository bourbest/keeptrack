import React from 'react'
import { Link } from 'react-router'
// import { Button } from 'semantic-ui-react'

const Toolbar = (props) => {
  const {backTo, title, children} = props
  return (
    <div className="ui secondary menu crudtoolbar middle aligned content">
      {backTo && <Link to={backTo} className="item back-button"><i className="big left arrow circle outline icon"></i></Link>}
      <div className="item section-title">{title}</div>
      <div className="ui secondary right menu">
        {children}
      </div>
    </div>
  )
}

Toolbar.propTypes = {
  title: React.PropTypes.string.isRequired,
  backTo: React.PropTypes.string,
  children: React.PropTypes.any
}

export default Toolbar
