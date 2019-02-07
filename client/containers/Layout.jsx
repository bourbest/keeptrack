import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createTranslate } from '../locales/translate'

import ReduxToastr from 'react-redux-toastr'
import { ActionCreators as AuthActions } from '../modules/authentication/actions'
import { ActionCreators as FormShortcutActions } from '../modules/form-shortcut/actions'
import { getUser } from '../modules/authentication/selectors'
import { getLocale } from '../modules/app/selectors'
import FormShortcutSelectors from '../modules/form-shortcut/selectors'

import NavBar from './components/NavBar'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AuthActions, dispatch),
    formShortcutActions: bindActionCreators(FormShortcutActions, dispatch)
  }
}

class Layout extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate(null, this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentWillMount () {
    this.props.formShortcutActions.fetchList()
  }

  handleLogout () {
    this.props.actions.logoutUser()
  }

  render () {
    return (
      <div className="page-content">
        <NavBar
          location={this.context.router.location.pathname}
          locale={this.props.locale}
          user={this.props.user}
          onLogout={this.handleLogout}
          formShortcuts={this.props.formShortcuts}
        />
        <div className="container">
          {this.props.children}
        </div>
        <ReduxToastr timeOut={4000}
          newestOnTop={false}
          preventDuplicates
          position="bottom-right"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          progressBar />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: getUser(state),
    locale: getLocale(state),
    formShortcuts: FormShortcutSelectors.getEntitiesPage(state)
  }
}

Layout.propTypes = {
  children: PropTypes.object,
  params: PropTypes.object,
  user: PropTypes.object,
  locale: PropTypes.string
}

Layout.contextTypes = {
  router: PropTypes.object.isRequired
}

const LayoutConnected = connect(mapStateToProps, mapDispatchToProps)(Layout)

export default LayoutConnected
