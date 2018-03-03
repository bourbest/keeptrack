import {size, map, uniq, trim} from 'lodash'
import { required, hasMinRows, isDateAfterOrEqualsToField, isDate, isInteger, isWithinRange, validateEntity } from '../common/validate'

export default (form) => {
  return null
}

const choicesAreUniq = (choices) => {
  const en = map(choices, 'labels.en').map(trim)
  const fr = map(choices, 'labels.fr').map(trim)
  const values = map(choices, 'value').map(trim)
  let error = null
  if (uniq(en).length !== en.length) {
    error = {_error: 'formTemplates.duplicateEnglishLabel'}
  } else if (uniq(fr).length !== fr.length) {
    error = {_error: 'formTemplates.duplicateFrenchLabel'}
  } else if (uniq(values).length !== values.length) {
    error = {_error: 'formTemplates.duplicateValue'}
  }
  return error
}

const LABELS_REQUIRED = {
  'labels.fr': [required],
  'labels.en': [required]
}

const CHOICES_REQUIRED = {
  'choices': [required, hasMinRows(2), choicesAreUniq]
}

const VALID_MAX_LENGHT = {
  'maxLength': [isInteger, isWithinRange(1, 4096)]
}

const VALID_DATE_MIN_MAX = {
  'minValue': [isDate],
  'maxValue': [isDate, isDateAfterOrEqualsToField('minValue', 'form-field-editor.minValue')]
}

const VALID_RATING_VALUE = {
  'maxValue': [required, isInteger, isWithinRange(3, 10)]
}

const VALID_MAX_FILE_SIZE = {
  'maxFileSize': [isInteger, isWithinRange(1, 1024)]
}

const VALIDATIONS_BY_CONTROL_TYPE = {
  'input': {...LABELS_REQUIRED, ...VALID_MAX_LENGHT},
  'checkbox': LABELS_REQUIRED,
  'textarea': {...LABELS_REQUIRED, ...VALID_MAX_LENGHT},
  'radio-list': {...LABELS_REQUIRED, ...CHOICES_REQUIRED},
  'checkbox-list': {...LABELS_REQUIRED, ...CHOICES_REQUIRED},
  'combobox': {...LABELS_REQUIRED, ...CHOICES_REQUIRED},
  'date': {...LABELS_REQUIRED, ...VALID_DATE_MIN_MAX},
  'title': LABELS_REQUIRED,
  'paragraph': LABELS_REQUIRED,
  'rating': {...LABELS_REQUIRED, ...VALID_RATING_VALUE},
  'file': {...LABELS_REQUIRED, ...VALID_MAX_FILE_SIZE}
}

export const validateNode = (node) => {
  const validations = VALIDATIONS_BY_CONTROL_TYPE[node.controlType]
  const errors = validateEntity(node, validations)
  if (size(errors) > 0) {
    return errors
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
