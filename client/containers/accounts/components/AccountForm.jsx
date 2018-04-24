import React from 'react'
import PropTypes from 'prop-types'

// Components
import { reduxForm, Field } from 'redux-form'
import {TextField, CheckboxList, SearchableSelectField} from '../../components/forms'
import { Form } from 'semantic-ui-react'
import {createTranslate} from '../../../locales/translate'

// module stuff
import config from '../../../modules/accounts/config'

import validateAccount from '../../../modules/accounts/validate'

class AccountForm extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('accounts', this)
  }

  render () {
    const {locale, isNew, roleOptionList, organismRoleOptionList} = this.props
    return (
      <Form>
        <Field name="userName" label={this.message('userName')} required component={TextField} locale={locale} />
        <Field name="lastName" label={this.message('lastName')} required component={TextField} locale={locale} />
        <Field name="firstName" label={this.message('firstName')} required component={TextField} locale={locale} />
        <Field name="organismRole" label={this.message('organismRole')} required component={SearchableSelectField} locale={locale} options={organismRoleOptionList} />
        <Field name="email" label={this.message('email')} required component={TextField} locale={locale} />
        <Field name="password" label={this.message('password')} required={isNew} component={TextField} locale={locale} type="password" />
        <Field name="confirmPassword" label={this.message('confirmPassword')} required={isNew} component={TextField} locale={locale} type="password" />
        <Field name="roles" label={this.message('roles')} component={CheckboxList} locale={locale} options={roleOptionList} />
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
