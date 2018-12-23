import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { canInteractWithClient, formsManager, usersManager, statsProducer } from '../../modules/accounts/roles'
import { createTranslate } from '../../locales/translate'
class NavBar extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('navigation', this)
  }

  render () {
    const user = this.props.user
    const menuItems = [
      { name: 'dashboard', link: '/dashboard', labelKey: 'dashboard', role: canInteractWithClient },
      { name: 'clients', link: '/clients', labelKey: 'clients', role: canInteractWithClient },
      { name: 'formTemplates', link: '/form-templates', labelKey: 'formTemplates', role: formsManager },
      { name: 'accounts', link: '/accounts', labelKey: 'accounts', role: usersManager },
      { name: 'createEvolutionNote', link: '/new-evolution-note', labelKey: 'createEvolutionNote' },
      { name: 'reports', link: '/reports/distribution-list', labelKey: 'reports', role: statsProducer }
    ]

    let currentLocation = this.props.location
    if (currentLocation.indexOf('/') !== 0) {
      currentLocation = '/' + currentLocation
    }
    return (
      <div className="navbar navbar-expand bg-dark text-light">
        <div className="container">
          <ul className="navbar-nav">
            {menuItems.map(
              (menuItem) => {
                if (!menuItem.role || (user.roles && user.roles.indexOf(menuItem.role) > -1)) {
                  const isActive = currentLocation.indexOf(menuItem.link) !== -1
                  const className = isActive ? 'active nav-item' : 'nav-item'
                  return (
                    <li className={className} key={menuItem.name}>
                      <Link
                        to={menuItem.link}
                        className="nav-link text-light"
                      >
                        {this.message(menuItem.labelKey)}
                      </Link>
                    </li>)
                }
                return null
              }
            )}
          </ul>
          <form className="form-inline clickable" onClick={this.props.onLogout}>
            {this.message('quit')}
          </form>
        </div>
      </div>
    )
  }
}

NavBar.propTypes = {
  location: PropTypes.string,
  locale: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired
}

export default NavBar
