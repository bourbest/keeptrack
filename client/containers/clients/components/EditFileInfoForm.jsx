import React from 'react'
import PropTypes from 'prop-types'

// Components
import { reduxForm, Field } from 'redux-form'
import {Input, DateInput, FieldWrapper} from '../../components/forms'
import {createTranslate} from '../../../locales/translate'
import {Form} from '../../components/controls/SemanticControls'

// module stuff
import config from '../../../modules/uploaded-files/config'

import validateFileInfo from '../../../modules/uploaded-files/schema'

class EditFileInfoForm extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('editFileInfo', this)
  }

  render () {
    const {locale} = this.props
    return (
      <Form>
        <Field name="name" label={this.message('name')} required component={FieldWrapper} InputControl={Input} locale={locale} />
        <Field name="documentDate" label={this.message('documentDate')} required component={FieldWrapper} InputControl={DateInput} locale={locale} />
      </Form>
    )
  }
}

ChangePasswordForm.propTypes = {
  locale: PropTypes.string.isRequired
}

const ConnectedChangePasswordForm = reduxForm({
  form: config.entityName,
  validate: validateFileInfo
})(ChangePasswordForm)

export default ConnectedChangePasswordForm
