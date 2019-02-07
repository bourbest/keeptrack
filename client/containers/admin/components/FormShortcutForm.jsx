import React from 'react'
import PropTypes from 'prop-types'

// Components
import { reduxForm, Field } from 'redux-form'
import {Input, Select, FieldWrapper} from '../../components/forms'
import {createTranslate} from '../../../locales/translate'
import {Form} from '../../components/controls/SemanticControls'
// module stuff
import config from '../../../modules/form-shortcut/config'

import validateFormShortcut from '../../../modules/form-shortcut/schema'

class FormShortcutForm extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('form-shortcut', this)
  }

  render () {
    const {locale, formTemplateOptions} = this.props
    return (
      <Form>
        <div className="row">
          <div className="col-12">
            <Field name="formTemplateId" label={this.message('formTemplate')} required component={FieldWrapper}
              InputControl={Select} locale={locale} options={formTemplateOptions} idProperty="value"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <label>{this.message('label')}</label>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Field name="labels.fr" label={this.message('fr', 'common')} required component={FieldWrapper} InputControl={Input} locale={locale} />
          </div>
          <div className="col-md-6">
            <Field name="labels.en" label={this.message('en', 'common')} required component={FieldWrapper} InputControl={Input} locale={locale} />
          </div>
        </div>
      </Form>
    )
  }
}

FormShortcutForm.propTypes = {
  locale: PropTypes.string.isRequired,
  formTemplateOptions: PropTypes.array.isRequired
}

const ConnectedFormShortcutForm = reduxForm({
  form: config.entityName,
  validate: validateFormShortcut
})(FormShortcutForm)

export default ConnectedFormShortcutForm
