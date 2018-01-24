import React from 'react'
import config, {CONTROL_CONFIG_BY_TYPE} from '../../../modules/form-templates/config'
import {validateNode} from '../../../modules/form-templates/validate'
// components
import {Form} from 'semantic-ui-react'
import ChoiceListEditor from './ChoiceListEditor'
import { Field, FieldArray, reduxForm } from 'redux-form'
import FormHtmlEditor from '../../components/forms/FormHtmlEditor'
import TextField from '../../components/forms/TextField'
import SelectField from '../../components/forms/SelectField'
import CheckboxField from '../../components/forms/Checkbox'
import DateField from '../../components/forms/DateField'
import { FormError } from '../../components/forms/FormError'
import {createTranslate} from '../../../locales/translate'

const COLUMN_OPTIONS = [
  {id: 1, text: '1'},
  {id: 2, text: '2'},
  {id: 3, text: '3'},
  {id: 4, text: '4'}
]

const HEADER_LEVELS = COLUMN_OPTIONS // mêmes options so...

class FieldAttributesEditor extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('form-field-editor', this)
  }

  render () {
    const {locale, error, editedField} = this.props
    if (!editedField) return null

    const controlConfig = CONTROL_CONFIG_BY_TYPE[editedField.controlType]
    const properties = new Set(controlConfig.properties)

    return (
      <div>
        <FormError error={error} locale={locale} />
        <Form>
          {properties.has('labels') && editedField.controlType !== 'paragraph' &&
            <Field name="labels.fr" label={this.message('labelFr')} required component={TextField} locale={locale} />
          }
          {properties.has('labels') && editedField.controlType !== 'paragraph' &&
            <Field name="labels.en" label={this.message('labelEn')} required component={TextField} locale={locale} />
          }

          {properties.has('labels') && editedField.controlType === 'paragraph' &&
            <Field name="labels.fr" label={this.message('labelFr')} required component={FormHtmlEditor} locale={locale} />
          }
          {properties.has('labels') && editedField.controlType === 'paragraph' &&
            <Field name="labels.en" label={this.message('labelEn')} required component={FormHtmlEditor} locale={locale} />
          }

          {properties.has('isRequired') &&
            <Field name="isRequired" label={this.message('isRequired')} component={CheckboxField} locale={locale} />
          }

          {properties.has('maxLength') &&
            <Field name="maxLength" label={this.message('maxLength')} component={TextField} locale={locale} />
          }

          {properties.has('columnCount') &&
            <Field name="columnCount" label={this.message('columnCount')} component={SelectField} locale={locale}
              values={COLUMN_OPTIONS} textPropertyByLocale={false} textProperty="text" noSelectionValue={null}
            />
          }

          {properties.has('headerLevel') &&
            <Field name="headerLevel" label={this.message('level')} component={SelectField} locale={locale}
              values={HEADER_LEVELS} textPropertyByLocale={false} textProperty="text" noSelectionValue={null}
          />
          }

          {editedField.controlType === 'date' &&
            <Field name="useCurrentDateAsDefaultValue" label={this.message('useCurrentDateAsDefaultValue')} component={CheckboxField} locale={locale} />
          }

          {editedField.controlType === 'date' &&
            <Field name="minValue" label={this.message('minValue')} component={DateField} locale={locale} />
          }

          {editedField.controlType === 'date' &&
            <Field name="maxValue" label={this.message('maxValue')} component={DateField} locale={locale} />
          }

          {editedField.controlType !== 'date' && properties.has('minValue') &&
            <Field name="minValue" label={this.message('minValue')} component={TextField} locale={locale} />
          }

          {editedField.controlType !== 'date' && properties.has('maxValue') &&
            <Field name="maxValue" label={this.message('maxValue')} component={TextField} locale={locale} />
          }

          {properties.has('maxFileSize') &&
            <Field name="maxFileSize" label={this.message('maxFileSize')} component={TextField} locale={locale} />
          }

          {properties.has('choices') &&
            <FieldArray name="choices"
              component={ChoiceListEditor}
              locale={locale}
              formName={config.fieldEditorFormName}
              choices={editedField.choices}
              onChoiceDeleted={this.props.onChoiceDeleted}
              onAddChoice={this.props.onAddChoice}
            />
          }
        </Form>
      </div>
    )
  }
}

const handleFormChanged = (formValues, dispatch, props) => {
  if (formValues && formValues.id) { // recoit un objet vide lorsqu'il n'y a pas de contrôle sélectionné
    props.onPropertiesChanged(formValues)
  }
}

const FormFieldEditor = reduxForm({
  form: config.fieldEditorFormName,
  validate: validateNode,
  onChange: handleFormChanged
})(FieldAttributesEditor)

FieldAttributesEditor.propTypes = {
  editedField: React.PropTypes.object,
  locale: React.PropTypes.string.isRequired,
  onPropertiesChanged: React.PropTypes.func.isRequired,
  onChoiceDeleted: React.PropTypes.func.isRequired,
  onAddChoice: React.PropTypes.func.isRequired,
  pristine: React.PropTypes.bool,
  error: React.PropTypes.string,
  valid: React.PropTypes.bool
}

export default FormFieldEditor
