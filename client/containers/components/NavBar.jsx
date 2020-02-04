import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import {forEach, map, compact} from 'lodash'
import { formsManager, usersManager, statsProducer, canCreateClientFiles } from '../../modules/accounts/roles'
import { createTranslate } from '../../locales/translate'

import {DropdownMenu} from '../components/controls/DropdownMenu'
import UserDropdownMenu from './behavioral/UserDropdownMenu'

class NavBar extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('navigation', this)
    this.renderChildItem = this.renderChildItem.bind(this)
  }

  renderChildItem (menuItem) {
    const user = this.props.user
    if (!menuItem.role || (user.roles && user.roles.indexOf(menuItem.role) > -1)) {
      return (
        <Link
          key={menuItem.name}
          to={menuItem.link}
          className="dropdown-item"
        >
          {menuItem.labelKey && this.message(menuItem.labelKey)}
          {menuItem.label}
        </Link>
      )
    }
    return null
  }

  render () {
    const {user, locale} = this.props
    const menuItems = [
      { name: 'dashboard', link: '/dashboard', labelKey: 'dashboard' },
      { name: 'clients', link: '/clients', labelKey: 'clients', role: canCreateClientFiles },
      { name: 'admin', labelKey: 'admin', menus: [
        { name: 'formTemplates', link: '/form-templates', labelKey: 'formTemplates', role: formsManager },
        { name: 'accounts', link: '/accounts', labelKey: 'accounts', role: usersManager },
        { name: 'formShortcuts', link: '/form-shortcuts', labelKey: 'formShortcuts', role: usersManager }
      ] },
      { name: 'generateReport', link: '/reports/generate', labelKey: 'reports', role: statsProducer }
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
                  const className = isActive ? 'active' : ''
                  const subMenus = compact(map(menuItem.menus, this.renderChildItem))

                  if (subMenus.length) {
                    return (
                      <DropdownMenu className={`${className}`} key={menuItem.name} label={this.message(menuItem.labelKey)}>
                        {subMenus}
                      </DropdownMenu>
                    )
                  } else if (!menuItem.menus) {
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
                  } else {
                    return null
                  }
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
