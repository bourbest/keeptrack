import React from 'react'
import PropTypes from 'prop-types'

// Components
import { reduxForm, Field } from 'redux-form'
import {TextField, CheckboxField} from '../../components/forms'
import { Form } from 'semantic-ui-react'
const SemanticField = Form.Field
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
    const {locale, isNew, roleOptionList} = this.props
    return (
      <Form>
        <Field name="userName" label={this.message('userName')} required component={TextField} locale={locale} />
        <Field name="lastName" label={this.message('lastName')} required component={TextField} locale={locale} />
        <Field name="firstName" label={this.message('firstName')} required component={TextField} locale={locale} />
        <Field name="email" label={this.message('email')} required component={TextField} locale={locale} />
        <Field name="password" label={this.message('password')} required={isNew} component={TextField} locale={locale} type="password" />
        <Field name="confirmPassword" label={this.message('confirmPassword')} required={isNew} component={TextField} locale={locale} type="password" />
        <SemanticField>
          <label>{this.message('roles')}</label>
          {
            roleOptionList.map((roleOption) => {
              const name = `roles.${roleOption.value}`
              return (<Field key={roleOption.value} name={name} label={roleOption.label} component={CheckboxField} locale={locale} />)
            })
          }
        </SemanticField>
      </Form>
    )
  }
}

AccountForm.propTypes = {
  locale: PropTypes.string.isRequired,
  roleOptionList: PropTypes.array.isRequired,
  isNew: PropTypes.bool.isRequired
}

const ConnectedAccountForm = reduxForm({
  form: config.entityName,
  validate: validateAccount
})(AccountForm)

export default ConnectedAccountForm
