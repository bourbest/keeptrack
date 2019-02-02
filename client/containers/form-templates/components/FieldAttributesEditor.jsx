import React from 'react'
import PropTypes from 'prop-types'
import config, {CONTROL_CONFIG_BY_TYPE} from '../../../modules/form-templates/config'
import {validateNode} from '../../../modules/form-templates/validate'
// components
import {Form} from '../../components/controls/SemanticControls'
import ChoiceListEditor from './ChoiceListEditor'
import { Field, FieldArray, reduxForm } from 'redux-form'
import FormHtmlEditor from '../../components/forms/FormHtmlEditor'
import {FieldWrapper, Input, Select, Checkbox, DateInput} from '../../components/forms'
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
      <div className="ml-2 mr-2">
        <FormError error={error} locale={locale} />
        <Form>
          {properties.has('labels') && editedField.controlType !== 'paragraph' &&
            <Field name="labels.fr" label={this.message('labelFr')} required component={FieldWrapper}
              InputControl={Input} locale={locale} readOnly={editedField.lockLabels} />
          }
          {properties.has('labels') && editedField.controlType !== 'paragraph' &&
            <Field name="labels.en" label={this.message('labelEn')} required component={FieldWrapper}
              InputControl={Input} locale={locale} readOnly={editedField.lockLabels} />
          }

          {properties.has('labels') && editedField.controlType === 'paragraph' &&
            <Field name="labels.fr" label={this.message('labelFr')} required component={FieldWrapper}
              InputControl={FormHtmlEditor} locale={locale} readOnly={editedField.lockLabels} />
          }
          {properties.has('labels') && editedField.controlType === 'paragraph' &&
            <Field name="labels.en" label={this.message('labelEn')} required component={FieldWrapper}
              InputControl={FormHtmlEditor} locale={locale} readOnly={editedField.lockLabels} />
          }

          {properties.has('required') &&
            <Field name="required" label={this.message('isRequired')} component={FieldWrapper}
              InputControl={Checkbox} locale={locale} disabled={editedField.lockRequired} />
          }

          {properties.has('maxLength') &&
            <Field name="maxLength" label={this.message('maxLength')} component={FieldWrapper}
              InputControl={Input} locale={locale} readOnly={editedField.lockMaxLength} />
          }

          {properties.has('columnCount') &&
            <Field name="columnCount" label={this.message('columnCount')} component={FieldWrapper} InputControl={Select} locale={locale}
              options={COLUMN_OPTIONS} textPropertyByLocale={false} textProperty="text" noSelectionValue={null}
            />
          }

          {properties.has('headerLevel') &&
            <Field name="headerLevel" label={this.message('level')} component={FieldWrapper} InputControl={Select} locale={locale}
              options={HEADER_LEVELS} textPropertyByLocale={false} textProperty="text" noSelectionValue={null}
          />
          }

          {editedField.controlType === 'date' &&
            <Field name="useCurrentDateAsDefaultValue" label={this.message('useCurrentDateAsDefaultValue')}
              component={FieldWrapper} InputControl={Checkbox} locale={locale} />
          }

          {editedField.controlType === 'date' &&
            <Field name="minValue" label={this.message('minValue')} component={FieldWrapper}
              InputControl={DateInput} locale={locale} readOnly={editedField.lockMinValue} />
          }

          {editedField.controlType === 'date' &&
            <Field name="maxValue" label={this.message('maxValue')} component={FieldWrapper}
              InputControl={DateInput} locale={locale} readOnly={editedField.lockMaxValue} />
          }

          {editedField.controlType !== 'date' && properties.has('minValue') &&
            <Field name="minValue" label={this.message('minValue')} component={FieldWrapper}
              InputControl={Input} locale={locale} readOnly={editedField.lockMinValue} />
          }

          {editedField.controlType !== 'date' && properties.has('maxValue') &&
            <Field name="maxValue" label={this.message('maxValue')} component={FieldWrapper}
              InputControl={Input} locale={locale} readOnly={editedField.lockMaxValue} />
          }

          {properties.has('choices') &&
            <FieldArray name="choices"
              component={ChoiceListEditor}
              locale={locale}
              formName={config.fieldEditorFormName}
              choices={editedField.choices}
              showArchivedChoices={this.props.showArchivedChoices}
              onAddChoice={this.props.onAddChoice}
              onToggleShowArchived={this.props.onToggleShowArchived}
              lockChoiceValues={editedField.lockChoiceValues}
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
  editedField: PropTypes.object,
  locale: PropTypes.string.isRequired,
  showArchivedChoices: PropTypes.bool.isRequired,
  onToggleShowArchived: PropTypes.func.isRequired,
  onPropertiesChanged: PropTypes.func.isRequired,
  onAddChoice: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  error: PropTypes.string,
  valid: PropTypes.bool
}

export default FormFieldEditor
