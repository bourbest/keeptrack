import React from 'react'
import PropTypes from 'prop-types'

// Components
import { reduxForm, Field } from 'redux-form'
import {Input, FieldWrapper} from '../../components/forms'
import {createTranslate} from '../../../locales/translate'
import {Form} from '../../components/controls/SemanticControls'

// module stuff
import config from '../../../modules/my-account/config'

import {validateChangePassword} from '../../../modules/my-account/schema'

class ChangePasswordForm extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('accounts', this)
  }

  render () {
    const {locale} = this.props
    return (
      <Form>
        <Field name="oldPassword" label={this.message('oldPassword')} required component={FieldWrapper} InputControl={Input} locale={locale} type="password" />
        <Field name="newPassword" label={this.message('newPassword')} required component={FieldWrapper} InputControl={Input} locale={locale} type="password" />
        <Field name="confirmPassword" label={this.message('confirmPassword')} required component={FieldWrapper} InputControl={Input} locale={locale} type="password" />
      </Form>
    )
  }
}

ChangePasswordForm.propTypes = {
  locale: PropTypes.string.isRequired
}

const ConnectedChangePasswordForm = reduxForm({
  form: config.entityName,
  validate: validateChangePassword
})(ChangePasswordForm)

export default ConnectedChangePasswordForm
