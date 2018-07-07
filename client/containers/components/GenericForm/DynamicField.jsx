import React from 'react'
import {pick} from 'lodash'
import {Field} from 'redux-form'

import {Input, DateInput, Checkbox, TextArea, CheckboxList, RadioButtons, Select, FieldWrapper} from '../forms'
import FormHeader from './FormHeader'
import { Grid } from '../controls/SemanticControls'
import FormParagraph from './FormParagraph'

const INPUT_CONTROL_MAP = {
  'input': Input,
  'textarea': TextArea,
  'checkbox': Checkbox,
  'radio-list': RadioButtons,
  'checkbox-list': CheckboxList,
  'combobox': Select,
  'date': DateInput
}

const LAYOUT_CONTROLS_MAP = {
  'title': FormHeader,
  'paragraph': FormParagraph,
  'grid': Grid
}

// liste des attributs qui peuvent être passés à un DOM Node
const DOM_FIELD_OPTIONS = [
  'minValue', 'maxValue', 'maxLength', 'required', 'headerLevel'
]

const getInputControl = (controlType) => INPUT_CONTROL_MAP[controlType] || null
const getFieldComponent = (controlType) => {
  return LAYOUT_CONTROLS_MAP[controlType] || FieldWrapper
}

const buildOptions = (field, locale) => {
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

  if (field.controlType === 'checkbox') {
    options.text = field.labels[locale]
  } else if (field.controlType === 'paragraph') {
    options.label = field.labels[locale]
  } else if (field.labels) {
    options.label = field.labels[locale]
  }

  return options
}

export const outputField = (field, locale) => {
  const InputControl = getInputControl(field.controlType)
  const Component = getFieldComponent(field.controlType)
  const controlId = field.id
  const options = buildOptions(field, locale)

  if (InputControl) {
    return (
      <Field
        key={controlId}
        id={controlId}
        name={controlId}
        required={field.isRequired}
        {...options}
        locale={locale}
        component={Component}
        InputControl={InputControl}
      />)
  }

  return <Component key={controlId} id={controlId} {...options} />
}
