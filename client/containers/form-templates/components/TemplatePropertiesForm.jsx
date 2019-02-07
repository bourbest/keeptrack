import React from 'react'
import PropTypes from 'prop-types'

// Components
import { reduxForm, Field } from 'redux-form'
import {Select, Input, FieldWrapper} from '../../components/forms'
import {createTranslate} from '../../../locales/translate'
import {Form} from '../../components/controls/SemanticControls'
// module stuff
import config, {ClientLinkOptions, DocumentDateOptions} from '../../../modules/form-templates/config'

import validateTemplateProperties from '../../../modules/form-templates/schema'

class TemplatePropertiesForm extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('formTemplates', this)

    this.clientLinkOptions = [
      {id: ClientLinkOptions.NO_LINK, label: this.message('clientLinkOptions.noLink')},
      {id: ClientLinkOptions.MANDATORY, label: this.message('clientLinkOptions.mandatory')}
    ]

    this.documentDateOptions = [
      {id: DocumentDateOptions.USE_CREATION_DATE, label: this.message('documentDateOptions.useCreationDate')},
      {id: DocumentDateOptions.SET_BY_USER, label: this.message('documentDateOptions.setByUser')}
    ]
  }

  render () {
    const {locale} = this.props
    return (
      <Form>
        <Field name="clientLink" label={this.message('clientLink')} required component={FieldWrapper} InputControl={Select}
          locale={locale} options={this.clientLinkOptions} hasNoSelectionValue={false}
        />
        <Field name="documentDate" label={this.message('documentDate')} required component={FieldWrapper} InputControl={Select}
          locale={locale} options={this.documentDateOptions} hasNoSelectionValue={false}
        />
        <label>{this.message('documentDateLabel')}</label>
        <div className="row">
          <div className="col-6">
            <Field name="documentDateLabels.fr" label={this.message('fr', 'common')} component={FieldWrapper} InputControl={Input} locale={locale} />
          </div>
          <div className="col-6">
            <Field name="documentDateLabels.en" label={this.message('en', 'common')} component={FieldWrapper} InputControl={Input} locale={locale} />
          </div>
        </div>
      </Form>
    )
  }
}

TemplatePropertiesForm.propTypes = {
  locale: PropTypes.string.isRequired
}

const ConnectedTemplatePropertiesForm = reduxForm({
  form: config.entityName,
  validate: validateTemplateProperties
})(TemplatePropertiesForm)

export default ConnectedTemplatePropertiesForm
