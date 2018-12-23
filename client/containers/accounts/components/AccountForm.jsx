import React from 'react'
import PropTypes from 'prop-types'

// Components
import { reduxForm, Field } from 'redux-form'
import {CheckboxList, SearchableSelect, Input, FieldWrapper} from '../../components/forms'
import {createTranslate} from '../../../locales/translate'
import {Form} from '../../components/controls/SemanticControls'
// module stuff
import config from '../../../modules/accounts/config'

import validateAccount from '../../../modules/accounts/schema'

class AccountForm extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('accounts', this)
  }

  render () {
    const {locale, isNew, roleOptionList, organismRoleOptionList} = this.props
    return (
      <Form>
        <Field name="username" label={this.message('userName')} required component={FieldWrapper} InputControl={Input} locale={locale} />
        <Field name="lastName" label={this.message('lastName')} required component={FieldWrapper} InputControl={Input} locale={locale} />
        <Field name="firstName" label={this.message('firstName')} required component={FieldWrapper} InputControl={Input} locale={locale} />
        <Field name="organismRole" label={this.message('organismRole')} required component={FieldWrapper} InputControl={SearchableSelect} locale={locale} options={organismRoleOptionList} />
        <Field name="password" label={this.message('password')} required={isNew} component={FieldWrapper} InputControl={Input} locale={locale} type="password" />
        <Field name="confirmPassword" label={this.message('confirmPassword')} required={isNew} component={FieldWrapper} InputControl={Input} locale={locale} type="password" />
        <Field name="roles" label={this.message('roles')} component={FieldWrapper} InputControl={CheckboxList} locale={locale} options={roleOptionList} />
      </Form>
    )
  }
}

AccountForm.propTypes = {
  locale: PropTypes.string.isRequired,
  roleOptionList: PropTypes.array.isRequired,
  organismRoleOptionList: PropTypes.array.isRequired,
  isNew: PropTypes.bool.isRequired
}

const ConnectedAccountForm = reduxForm({
  form: config.entityName,
  validate: validateAccount
})(AccountForm)

export default ConnectedAccountForm
