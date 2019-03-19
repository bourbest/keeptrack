
import React from 'react'
import PropTypes from 'prop-types'

export class DropdownMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {isOpen: false}
    this.toggle = this.toggle.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  toggle () {
    this.setState({isOpen: !this.state.isOpen})
  }

  handleClick (event) {
    this.setState({isOpen: false})
  }

  render () {
    const {children, className, label} = this.props
    const dropdownClasses = ['nav-item dropdown']
    if (className) dropdownClasses.push(className)

    const menuClasses = ['dropdown-menu']
    if (this.state.isOpen) menuClasses.push('show')

    return (
      <li className={dropdownClasses.join(' ')} onClick={this.toggle}>
        <a className="nav-link dropdown-toggle text-light" data-toggle="dropdown" href="#" role="button">
          {label}
        </a>
        <div className={menuClasses.join(' ')}>
          {children}
        </div>
      </li>
    )
  }
}

DropdownMenu.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.any,
  className: PropTypes.string
}
