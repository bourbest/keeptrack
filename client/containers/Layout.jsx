import React from 'react'
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
      <div>
        <NavBar location={this.context.router.location.pathname} locale={this.props.locale} />
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
  children: React.PropTypes.object,
  params: React.PropTypes.object,
  user: React.PropTypes.object,
  locale: React.PropTypes.string
}

Layout.contextTypes = {
  router: React.PropTypes.object.isRequired
}

const LayoutConnected = connect(mapStateToProps)(Layout)

export default LayoutConnected
