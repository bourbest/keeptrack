import React from 'react'
import PropTypes from 'prop-types'

// Components
import { reduxForm, Field, FormSection } from 'redux-form'
import {Input, TextArea, RadioButtons, DateInput, Checkbox, PhoneFields, AddressField, FieldWrapper} from '../../components/forms'
import { Form } from '../../components/controls/SemanticControls'
import {createTranslate} from '../../../locales/translate'

// module stuff
import config from '../../../modules/clients/config'

import validateClient from '../../../modules/clients/schema'

class ClientForm extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('clients', this)
  }

  render () {
    const {locale, genderOptionList, originOptionList} = this.props
    return (
      <Form>
        <div className="box-fifth">
          <h2>Identification</h2>
          <div className="row">
            <div className="col-md-6">
              <Field name="firstName" label={this.message('firstName')} required component={FieldWrapper} InputControl={Input} locale={locale} />
            </div>
            <div className="col-md-6">
              <Field name="lastName" label={this.message('lastName')} required component={FieldWrapper} InputControl={Input} locale={locale} />
            </div>
            <div className="col-md-6">
              <Field name="gender" label={this.message('gender')} component={FieldWrapper} InputControl={RadioButtons} required locale={locale} options={genderOptionList} />
            </div>
            <div className="col-md-6">
              <Field name="birthDate" label={this.message('birthDate')} component={FieldWrapper} InputControl={DateInput} locale={locale} />
            </div>
            <div className="col-12">
              <Field name="originId" label={this.message('origin')} component={FieldWrapper} InputControl={RadioButtons} required locale={locale} options={originOptionList} />
            </div>
          </div>
        </div>

        <div className="box-fifth mt-4">
          <h2>Coordonnées</h2>
          <FormSection name="address">
            <AddressField locale={locale} />
          </FormSection>
          <FormSection name="mainPhoneNumber">
            <PhoneFields locale={locale} label="mainPhoneNumber" message={this.message} />
          </FormSection>
          <FormSection name="alternatePhoneNumber">
            <PhoneFields locale={locale} label="alternatePhoneNumber" message={this.message} />
          </FormSection>

          <div className="row">
            <div className="col-md-6">
              <Field name="email" label={this.message('email')} component={FieldWrapper} InputControl={Input} locale={locale} />
            </div>
            <div className="col-md-6 pt-md-4 mt-md-2">
              <Field name="acceptPublipostage" text={this.message('acceptPublipostage')} component={FieldWrapper} InputControl={Checkbox} locale={locale} />
            </div>
          </div>
          <Field name="notes" label={this.message('notes')} component={FieldWrapper} InputControl={TextArea} locale={locale} />
        </div>
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
