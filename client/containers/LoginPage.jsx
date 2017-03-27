import { ActionCreators as AuthActions } from '../modules/authentication/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getLoginError } from '../modules/authentication/selectors'
import React from 'react'

import GenericForm from '../components/GenericForm'

const fields = [
  {
    name: 'username',
    type: 'text',
    isRequired: true,
    label: 'Code usager'
  },
  {
    name: 'password',
    type: 'password',
    isRequired: true,
    label: 'Mot de passe'
  }
]

const { object, string } = React.PropTypes

const mapStateToProps = (state) => {
  return {
    loginError: getLoginError(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AuthActions, dispatch)
  }
}

class LoginPage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      password: ''
    }

    this.onChange = this.onChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  onChange (event) {
    const newState = { }
    newState[event.target.name] = event.target.value
    this.setState(newState)
  }
  handleSubmit (event) {
    event.preventDefault()
    this.props.actions.loginUser(this.state.username, this.state.password, this.props.location.query.ret)
  }

  render () {
    return (
      <div>
        <form onSubmit={this.handleSubmit} className='col-4' >
          <GenericForm fields={fields} values={this.state} onChange={this.onChange} />
          <button onClick={this.handleSubmit}>Authentifier</button>
        </form>
        <span>{this.props.loginError}</span>
      </div>
    )
  }
}

LoginPage.propTypes = {
  actions: object.isRequired,
  params: object,
  location: object.isRequired,
  loginError: string
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
