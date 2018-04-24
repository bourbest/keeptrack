import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { FORM_MANAGER, ACCOUNT_MANAGER, INTERACT_WITH_CLIENT } from '../../modules/app/roles'
import { createTranslate } from '../../locales/translate'
class NavBar extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('navigation', this)
  }

  render () {
    const user = this.props.user
    const menuItems = [
      { name: 'clients', link: '/clients', labelKey: 'clients', role: INTERACT_WITH_CLIENT },
      { name: 'formTemplates', link: '/form-templates', labelKey: 'formTemplates', role: FORM_MANAGER },
      { name: 'accounts', link: '/accounts', labelKey: 'accounts', role: ACCOUNT_MANAGER },
      { name: 'createEvolutionNote', link: '/new-evolution-note', labelKey: 'createEvolutionNote' }
    ]
    let currentLocation = this.props.location
    if (currentLocation.indexOf('/') !== 0) {
      currentLocation = '/' + currentLocation
    }
    return (
      <div className="topbar">
        <div className="ui menu container">
          {menuItems.map(
            (menuItem) => {
              if (!menuItem.role || user.roles.indexOf(menuItem.role) > -1) {
                const isActive = currentLocation.indexOf(menuItem.link) !== -1
                const className = isActive ? 'active item' : 'item'
                return (<Link
                  key={menuItem.name}
                  to={menuItem.link}
                  className={className}>
                  {this.message(menuItem.labelKey)}
                </Link>)
              }
              return null
            }
          )}
        </div>
      </div>
    )
  }
}

NavBar.propTypes = {
  location: PropTypes.string,
  locale: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
}

export default NavBar
