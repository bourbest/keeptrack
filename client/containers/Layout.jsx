import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createTranslate } from '../locales/translate'

import ReduxToastr from 'react-redux-toastr'
import { getUser } from '../modules/authentication/selectors'
import { getLocale } from '../modules/app/selectors'

import NavBar from './components/NavBar'

class Layout extends React.PureComponent {

  constructor (props) {
    super(props)
    this.message = createTranslate(null, this)
  }

  render () {
    return (
      <div className="page-content">
        <NavBar location={this.context.router.location.pathname} locale={this.props.locale} user={this.props.user} />
        <div className="ui container">
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
    locale: getLocale(state)
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

const LayoutConnected = connect(mapStateToProps)(Layout)

export default LayoutConnected
