import React from 'react'
import {browserHistory} from 'react-router'
import PropTypes from 'prop-types'
import {Icon} from '../controls/SemanticControls'
import { createTranslate } from '../../../locales/translate'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// module
import { ActionCreators as AuthActions } from '../../../modules/authentication/actions'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AuthActions, dispatch)
  }
}

class UserDropdownMenu extends React.Component {
  constructor (props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.onChangePassword = this.onChangePassword.bind(this)
    this.t = createTranslate('navigation', this)

    this.state = {
      isOpen: false
    }
  }

  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  onChangePassword () {
    browserHistory.push('/change-password')
  }

  render () {
    const classes = this.state.isOpen ? 'dropdown-menu show' : 'dropdown-menu'
    return (
      <li className="dropdown" onClick={this.toggle}>
        <Icon name="user" className="clickable" />
        <ul className={classes}>
          <li className="dropdown-item clickable" onClick={this.props.actions.logoutUser}>{this.t('quit')}</li>
          <li className="dropdown-item clickable" onClick={this.onChangePassword}>{this.t('changePassword')}</li>
        </ul>
      </li>
    )
  }
}

UserDropdownMenu.propTypes = {
  locale: PropTypes.string.isRequired,
  actions: PropTypes.object
}

const ConnectedUserDropdownMenu = connect(null, mapDispatchToProps)(UserDropdownMenu)

export default ConnectedUserDropdownMenu
