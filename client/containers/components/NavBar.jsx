import React from 'react'
import { Link } from 'react-router'
import { createTranslate } from '../../locales/translate'
class NavBar extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('navigation', this)
  }

  render () {
    const menuItems = [
      { name: 'clients', link: '/clients', labelKey: 'clients' },
      { name: 'forms', link: '/forms', labelKey: 'forms' }
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
              const isActive = currentLocation.indexOf(menuItem.link) !== -1
              const className = isActive ? 'active item' : 'item'
              return (<Link
                key={menuItem.name}
                to={menuItem.link}
                className={className}>
                {this.message(menuItem.labelKey)}
              </Link>)
            }
          )}
        </div>
      </div>
    )
  }
}

NavBar.propTypes = {
  location: React.PropTypes.string,
  locale: React.PropTypes.string.isRequired
}

export default NavBar
