import {size, map, uniq, trim} from 'lodash'
import { Schema, object, string, date, boolean, arrayOf, number, required, isInteger, withinRange, validate, isGteToField, oneOf } from 'sapin'
import { objectId, hasMinRows } from '../common/validate'
import {CONTROL_TYPES} from './config'

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
  'maxValue': date(isGteToField('minValue'))
}

const BASE_FIELD = {
  id: string(required),
  controlType: string([required, oneOf(CONTROL_TYPES)]),
  order: number,
  parentId: string
}

const VALIDATIONS_BY_CONTROL_TYPE = {
  'input': new Schema({...BASE_FIELD, ...LABELS_REQUIRED, ...VALID_MAX_LENGTH}),
  'checkbox': new Schema({...BASE_FIELD, ...LABELS_REQUIRED}),
  'textarea': new Schema({...BASE_FIELD, ...LABELS_REQUIRED, ...VALID_MAX_LENGTH}),
  'radio-list': new Schema({...BASE_FIELD, ...LABELS_REQUIRED, ...CHOICES_REQUIRED}),
  'checkbox-list': new Schema({...BASE_FIELD, ...LABELS_REQUIRED, ...CHOICES_REQUIRED}),
  'combobox': new Schema({...BASE_FIELD, ...LABELS_REQUIRED, ...CHOICES_REQUIRED}),
  'date': new Schema({...BASE_FIELD, ...LABELS_REQUIRED, ...VALID_DATE_MIN_MAX}),
  'title': new Schema({...BASE_FIELD, ...LABELS_REQUIRED}),
  'paragraph': new Schema({...BASE_FIELD, ...LABELS_REQUIRED}),
  'grid': new Schema({...BASE_FIELD, columnCount: number([isInteger, withinRange(1, 4)])})
}

export const validateNode = (value) => {
  const validations = VALIDATIONS_BY_CONTROL_TYPE[value.controlType]
  if (validations) {
    const errors = validate(value, validations)
    if (size(errors) > 0) {
      return errors
    }
  }
  return null
}

const nodeSchema = ({value}) => {
  return validateNode(value)
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

export const formSchema = new Schema({
  id: objectId,
  name: string(required),
  isArchived: boolean,
  createdOn: date,
  modifiedOn: date,
  fields: arrayOf(object(nodeSchema))
})
