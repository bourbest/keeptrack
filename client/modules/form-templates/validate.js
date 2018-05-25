import {size, map, uniq, trim} from 'lodash'
import { Schema, date, arrayOf, string, number, required, isInteger, withinRange, validate } from 'sapin'
import { hasMinRows, isDateAfterOrEqualsToField } from '../common/validate'

export default (form) => {
  return null
}

const choicesAreUniq = ({value}) => {
  const choices = value
  const en = map(choices, 'labels.en').map(trim)
  const fr = map(choices, 'labels.fr').map(trim)
  const values = map(choices, 'value').map(trim)
  let error = null
  if (uniq(en).length !== en.length) {
    error = {error: 'formTemplates.duplicateEnglishLabel'}
  } else if (uniq(fr).length !== fr.length) {
    error = {error: 'formTemplates.duplicateFrenchLabel'}
  } else if (uniq(values).length !== values.length) {
    error = {error: 'formTemplates.duplicateValue'}
  }
  return error
}

const LABELS_REQUIRED = {
  labels: {
    fr: string(required),
    en: string(required)
  }
}

const CHOICES_REQUIRED = {
  'choices': arrayOf({
    value: string(required),
    labels: {
      fr: string(required),
      en: string(required)
    }
  }, [hasMinRows(2), choicesAreUniq])
}

const VALID_MAX_LENGTH = {
  'maxLength': number([isInteger, withinRange(1, 4096)])
}

const VALID_DATE_MIN_MAX = {
  'minValue': date,
  'maxValue': date(isDateAfterOrEqualsToField('minValue', 'form-field-editor.minValue'))
}

const VALID_RATING_VALUE = {
  'maxValue': number([required, isInteger, withinRange(3, 10)])
}

const VALID_MAX_FILE_SIZE = {
  'maxFileSize': number([isInteger, withinRange(1, 1024)])
}

const VALIDATIONS_BY_CONTROL_TYPE = {
  'input': new Schema({...LABELS_REQUIRED, ...VALID_MAX_LENGTH}),
  'checkbox': new Schema(LABELS_REQUIRED),
  'textarea': new Schema({...LABELS_REQUIRED, ...VALID_MAX_LENGTH}),
  'radio-list': new Schema({...LABELS_REQUIRED, ...CHOICES_REQUIRED}),
  'checkbox-list': new Schema({...LABELS_REQUIRED, ...CHOICES_REQUIRED}),
  'combobox': new Schema({...LABELS_REQUIRED, ...CHOICES_REQUIRED}),
  'date': new Schema({...LABELS_REQUIRED, ...VALID_DATE_MIN_MAX}),
  'title': new Schema(LABELS_REQUIRED),
  'paragraph': new Schema(LABELS_REQUIRED),
  'rating': new Schema({...LABELS_REQUIRED, ...VALID_RATING_VALUE}),
  'file': new Schema({...LABELS_REQUIRED, ...VALID_MAX_FILE_SIZE})
}

export const validateNode = (node) => {
  const validations = VALIDATIONS_BY_CONTROL_TYPE[node.controlType]
  if (validations) {
    const errors = validate(node, validations)
    if (size(errors) > 0) {
      return errors
    }
  }
  return null
}

export const validateNodes = (nodes) => {
  const errorsByNodeId = {}
  for (let i = 0; i < nodes.length; i++) {
    const error = validateNode(nodes[i])
    if (error) {
      errorsByNodeId[nodes[i].id] = error
    }
  }
  return errorsByNodeId
}
