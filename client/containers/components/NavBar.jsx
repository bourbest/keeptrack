import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import {forEach} from 'lodash'
import { canInteractWithClient, formsManager, usersManager, statsProducer } from '../../modules/accounts/roles'
import { createTranslate } from '../../locales/translate'

import UserDropdownMenu from './behavioral/UserDropdownMenu'

class NavBar extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('navigation', this)
  }

  render () {
    const {user, locale} = this.props
    const menuItems = [
      { name: 'dashboard', link: '/dashboard', labelKey: 'dashboard', role: canInteractWithClient },
      { name: 'clients', link: '/clients', labelKey: 'clients', role: canInteractWithClient },
      { name: 'formTemplates', link: '/form-templates', labelKey: 'formTemplates', role: formsManager },
      { name: 'accounts', link: '/accounts', labelKey: 'accounts', role: usersManager },
      { name: 'reports', link: '/reports/distribution-list', labelKey: 'reports', role: statsProducer },
      { name: 'formShortcuts', link: '/form-shortcuts', labelKey: 'administration', role: usersManager },
      { name: 'generateReport', link: '/reports/generate', labelKey: 'generateReport', role: statsProducer }
    ]

    forEach(this.props.formShortcuts, shortcut => {
      menuItems.push({
        name: shortcut.id,
        link: `/fill-form/${shortcut.formTemplateId}`,
        label: shortcut.labels[locale]
      })
    })

    let currentLocation = this.props.location
    if (currentLocation.indexOf('/') !== 0) {
      currentLocation = '/' + currentLocation
    }

    return (
      <div className="navbar navbar-expand bg-dark text-light">
        <div className="container">
          <ul className="nav navbar-nav">
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
                        {menuItem.labelKey && this.message(menuItem.labelKey)}
                        {menuItem.label}
                      </Link>
                    </li>)
                }
                return null
              }
            )}
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <UserDropdownMenu locale={this.props.locale} />
          </ul>
        </div>
      </div>
    )
  }
}

NavBar.propTypes = {
  location: PropTypes.string,
  formShortcuts: PropTypes.array.isRequired,
  locale: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired
}

export default NavBar
