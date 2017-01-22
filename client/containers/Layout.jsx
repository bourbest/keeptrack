import React from 'react'
import { Link } from 'react-router'

const Layout = (props) => (
  <div>
    <nav>
      <span><Link to="/client">Clients</Link></span>
      <span><Link to="/call-form/">Formulaire d'appel</Link></span>
    </nav>
    <div>
    {props.children}
    </div>
  </div>
)

const { element } = React.PropTypes

Layout.propTypes = {
  children: element.isRequired
}

export default Layout
