import { ActionCreators as AuthActions } from '../redux/modules/authentication'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getLoginError } from '../redux/selectors/authentication-selectors'
import React from 'react'

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

    this.handleInputEvent = this.handleInputEvent.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleInputEvent (event) {
    const newState = {}
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
        <div>
          <form onSubmit={this.handleSubmit} >
            <label>Code utilisateur:</label><input type="text" name="username" onChange={this.handleInputEvent} value={this.state.username} />
            <label>Mot de passe</label><input type="password" name="password" onChange={this.handleInputEvent} value={this.state.password} />
            <button onClick={this.handleSubmit}>Authentifier</button>
          </form>
          <span>{this.props.loginError}</span>
        </div>
      </div>
    )
  }
}

LoginPage.propTypes = {
  actions: object.isRequired,
  params: object,
  loginError: string
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
