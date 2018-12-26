import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// sections components
import ChangePasswordForm from './components/ChangePasswordForm'
import {Button} from '../components/controls/SemanticControls'
import { FormError } from '../components/forms/FormError'
import {createTranslate} from '../../locales/translate'

// actions and selectors
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as MyAccountActions } from '../../modules/my-account/actions'
import MyAccountSelectors from '../../modules/my-account/selectors'
import {getLocale} from '../../modules/app/selectors'

const labelNamespace = 'changePassword'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(MyAccountActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch)
  }
}

class ChangePasswordPage extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.message = createTranslate(labelNamespace, this)
  }

  handleSubmit () {
    const notify = this.props.appActions.notify

    this.props.actions.submitChangePassword(this.props.changePasswordForm, (entity) => {
      browserHistory.goBack()
      notify('common.save', 'common.saved')
    })
  }

  handleCancel () {
    browserHistory.goBack()
  }

  render () {
    const {canSave, error, locale} = this.props

    return (
      <div>
        <h1>{this.message('title')}</h1>
        <FormError error={error} locale={locale} />
        <ChangePasswordForm locale={locale} />
        <Button disabled={!canSave} onClick={this.handleSubmit} primary className="mr-2">
          {this.message('common.save')}
        </Button>
        <Button onClick={this.handleCancel}>
          {this.message('common.cancel')}
        </Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const props = {
    changePasswordForm: MyAccountSelectors.getChangePasswordForm(state),
    canSave: MyAccountSelectors.canSaveNewPassword(state),
    error: MyAccountSelectors.getChangePasswordError(state),
    locale: getLocale(state)
  }
  return props
}

ChangePasswordPage.propTypes = {
  changePasswordForm: PropTypes.object,
  canSave: PropTypes.bool.isRequired,
  error: PropTypes.object,
  locale: PropTypes.string.isRequired
}

const ConnectedChangePasswordPage = connect(mapStateToProps, mapDispatchToProps)(ChangePasswordPage)

export default ConnectedChangePasswordPage
