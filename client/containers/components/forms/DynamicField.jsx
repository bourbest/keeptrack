import React from 'react'
import {pick} from 'lodash'
import {Field} from 'redux-form'

import TextArea from './TextArea'
import TextInput from './TextField'
import DateField from './DateField'
import SelectField from './SearchableSelectField'
import Checkbox from './Checkbox'
import FormHeader from './FormHeader'
import { Grid } from '../controls/SemanticControls'
import CheckboxList from './CheckboxList'
import RadioButtons from './RadioButtons'
import FormParagraph from './FormParagraph'

const CONTROL_MAP = {
  'input': TextInput,
  'textarea': TextArea,
  'checkbox': Checkbox,
  'radio-list': RadioButtons,
  'checkbox-list': CheckboxList,
  'combobox': SelectField,
  'date': DateField,
  'title': FormHeader,
  'paragraph': FormParagraph,
  'grid': Grid
}

// liste des attributs qui peuvent être passés à un DOM Node
const DOM_FIELD_OPTIONS = [
  'minValue', 'maxValue', 'maxLength', 'required', 'headerLevel'
]

const getControl = (controlType) => CONTROL_MAP[controlType]

const buildOptions = (field, locale, handlers) => {
  const options = pick(field, DOM_FIELD_OPTIONS)

  if (field.placeholders) {
    options.placeholder = field.placeholders[locale]
  }

  if (field.choices) {
    options.options = field.choices.map(c => {
      return {
        value: c.value,
        label: c.labels[locale],
        id: c.id
      }
    })
  }

  options.onChange = handlers.onChange
  options.onBlur = handlers.onBlur

  return options
}

export const outputField = (field, locale, handlers) => {
  const Control = getControl(field.controlType)
  const controlId = field.id
  const options = buildOptions(field, locale, handlers)

  return (
    <Field
      key={controlId}
      id={controlId}
      name={controlId}
      label={field.labels[locale]}
      required={field.isRequired}
      {...options}
      locale={locale}
      component={Control}
    />)
}
