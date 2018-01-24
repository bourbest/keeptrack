import React from 'react'

// Components
import { reduxForm, Field } from 'redux-form'
import {TextField, TextAreaField, RadioButtonsField} from '../../components/forms'
import { Form } from 'semantic-ui-react'
import {createTranslate} from '../../../locales/translate'

// module stuff
import config from '../../../modules/clients/config'

import validateClient from '../../../modules/clients/validate'

class ClientForm extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('clients', this)
  }

  render () {
    const {locale, genderOptionList} = this.props
    return (
      <Form>
        <Field name="lastName" label={this.message('lastName')} required component={TextField} locale={locale} />
        <Field name="firstName" label={this.message('firstName')} required component={TextField} locale={locale} />
        <Field name="gender" label={this.message('gender')} component={RadioButtonsField} required locale={locale} options={genderOptionList} />
        <Field name="email" label={this.message('email')} component={TextField} locale={locale} />
        <Field name="notes" label={this.message('notes')} component={TextAreaField} locale={locale} />
      </Form>
    )
  }
}

ClientForm.propTypes = {
  locale: React.PropTypes.string.isRequired,
  genderOptionList: React.PropTypes.array.isRequired
}

const ConnectedClientForm = reduxForm({
  form: config.entityName,
  validate: validateClient
})(ClientForm)

export default ConnectedClientForm
