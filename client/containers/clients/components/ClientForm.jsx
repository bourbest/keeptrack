import React from 'react'
import PropTypes from 'prop-types'

// Components
import { reduxForm, Field, FormSection } from 'redux-form'
import {TextField, TextAreaField, RadioButtonsField, DateField, CheckboxField, PhoneFields, AddressField} from '../../components/forms'
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
    const {locale, genderOptionList, originOptionList} = this.props
    return (
      <Form>
        <h2>identification</h2>
        <Field name="lastName" label={this.message('lastName')} required component={TextField} locale={locale} />
        <Field name="firstName" label={this.message('firstName')} required component={TextField} locale={locale} />
        <Field name="gender" label={this.message('gender')} component={RadioButtonsField} required locale={locale} options={genderOptionList} />
        <Field name="birthDate" label={this.message('birthDate')} component={DateField} locale={locale} />

        <h2>Coordonnées</h2>
        <FormSection name="address">
          <AddressField locale={locale} />
        </FormSection>
        <Field name="originId" label={this.message('origin')} component={RadioButtonsField} required locale={locale} options={originOptionList} />
        <FormSection name="mainPhoneNumber">
          <PhoneFields locale={locale} label="mainPhoneNumber" message={this.message} />
        </FormSection>
        <FormSection name="alternatePhoneNumber">
          <PhoneFields locale={locale} label="alternatePhoneNumber" message={this.message} />
        </FormSection>

        <Field name="email" label={this.message('email')} component={TextField} locale={locale} />
        <Field name="acceptPublipostage" label={this.message('acceptPublipostage')} component={CheckboxField} locale={locale} />
        <Field name="notes" label={this.message('notes')} component={TextAreaField} locale={locale} />
      </Form>
    )
  }
}

ClientForm.propTypes = {
  locale: PropTypes.string.isRequired,
  genderOptionList: PropTypes.array.isRequired,
  originOptionList: PropTypes.array.isRequired
}

const ConnectedClientForm = reduxForm({
  form: config.entityName,
  validate: validateClient
})(ClientForm)

export default ConnectedClientForm
