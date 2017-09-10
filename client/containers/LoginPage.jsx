import React from 'react'
import { browserHistory } from 'react-router'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// modules
import { ActionCreators as AuthActions } from '../modules/authentication/actions'
import { getLoginError } from '../modules/authentication/selectors'
import { getLocale } from '../modules/app/selectors'
import {createTranslate} from '../locales/translate'
import validate from '../modules/authentication/validate'

// components
import { FormError } from './components/forms/FormError'
import { Field, reduxForm } from 'redux-form'
import { Button, Form } from 'semantic-ui-react'
import TextField from './components/forms/TextField'

import AppConfig from '../config'
import AuthConfig from '../modules/authentication/config'

const mapStateToProps = (state) => {
  let initialValues = {}
  if (AppConfig.debugMode) {
    initialValues = {
      username: 'bourbest',
      password: 'test'
    }
  }
  return {
    loginError: getLoginError(state),
    locale: getLocale(state),
    initialValues
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AuthActions, dispatch)
  }
}

class LoginPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.onLoggedIn = this.onLoggedIn.bind(this)
    this.message = createTranslate('login', this)
  }

  onLoggedIn (user) {
    let targetLocation = this.props.location.query.ret
    if (!targetLocation || targetLocation === '/') {
      targetLocation = AuthConfig.defaultAuthenticatedPage(user.defaultCatalogId)
    }
    browserHistory.push(targetLocation)
  }

  handleSubmit (values) {
    this.props.actions.loginUser(values.username, values.password, this.onLoggedIn)
  }

  render () {
    const style = {width: '560px', margin: '29px auto 0', background: '#e9e9e9', padding: '55px'}
    const {loginError, locale} = this.props
    const {handleSubmit, valid, submitting} = this.props
    return (
      <div>
        <FormError error={loginError} locale={locale} />
        <Form style={style} onSubmit={handleSubmit(this.handleSubmit)}>

          <Field name="username" label={this.message('username')} component={TextField} locale={locale} />
          <Field name="password" label={this.message('password')} component={TextField} locale={locale} type="password" />

          <Button type="submit" disabled={submitting || !valid}>
            {this.message('authenticate')}
          </Button>
        </Form>
      </div>
    )
  }
}

LoginPage.propTypes = {
  actions: React.PropTypes.object.isRequired,
  params: React.PropTypes.object,
  location: React.PropTypes.object.isRequired,
  loginError: React.PropTypes.string,
  locale: React.PropTypes.string
}

const FormPage = reduxForm({
  form: 'login',
  validate,
  enableReinitialize: true
})(LoginPage)

const PageConnected = connect(mapStateToProps, mapDispatchToProps)(FormPage)
export default PageConnected
