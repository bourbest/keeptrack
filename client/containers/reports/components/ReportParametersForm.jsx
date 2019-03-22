import React from 'react'
import PropTypes from 'prop-types'

// Components
import { reduxForm, Field } from 'redux-form'
import {Select, FieldWrapper, DateInput} from '../../components/forms'
import {createTranslate} from '../../../locales/translate'
import {Form} from '../../components/controls/SemanticControls'

// module stuff
import config from '../../../modules/reports/config'
import {validateFormParams} from '../../../modules/reports/schema'

class ReportParametersForm extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('generateReport', this)
  }

  render () {
    const {locale, formTemplateOptionList} = this.props
    return (
      <Form>
        <Field name="formTemplateId" label={this.message('formName')} required component={FieldWrapper} InputControl={Select} locale={locale} options={formTemplateOptionList} />
        <Field name="fromDate" label={this.message('fromDate')} required component={FieldWrapper} InputControl={DateInput} locale={locale} />
        <Field name="toDate" label={this.message('toDate')} required component={FieldWrapper} InputControl={DateInput} locale={locale} />
      </Form>
    )
  }
}

ReportParametersForm.propTypes = {
  locale: PropTypes.string.isRequired,
  formTemplateOptionList: PropTypes.array.isRequired
}

const ConnectedReportParametersForm = reduxForm({
  form: config.entityName,
  validate: validateFormParams
})(ReportParametersForm)

export default ConnectedReportParametersForm
