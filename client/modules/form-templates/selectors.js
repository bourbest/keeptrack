import config, {CONTROL_CONFIG_BY_TYPE, DEFAULT_CONTROL_OPTIONS} from './config'
import {isEmpty, max, map, pick, size, filter} from 'lodash'
import { getFormValues } from 'redux-form'
import { createSelector } from 'reselect'

import {
  EMPTY_ARRAY,
  createBaseSelectors,
  buildSortedOptionList, EMPTY_OBJECT
} from '../common/selectors'
import {buildSchemaForFields} from './dynamic-form-validation'

const Selectors = createBaseSelectors(config.entityName)

Selectors.getOptionList = createSelector(
  [Selectors.getEntities],
  (entities) => {
    return buildSortedOptionList(entities, 'name')
  }
)

Selectors.getCreatableFormOptionList = createSelector(
  [Selectors.getEntities],
  (entities) => {
    const active = filter(entities, {isArchived: false})
    return buildSortedOptionList(active, 'name')
  }
)

Selectors.getOrderedRootControlIds = (state) => state[config.entityName].editedFormNodesByParentId['c0'] || EMPTY_ARRAY
Selectors.getControlIdsByParentId = (state) => state[config.entityName].editedFormNodesByParentId || EMPTY_OBJECT
Selectors.getControls = (state) => state[config.entityName].editedFormNodesById
Selectors.getEditedField = getFormValues(config.fieldEditorFormName)
Selectors.getNodeErrors = (state) => state[config.entityName].editedFormNodesErrors

Selectors.areNodesValid = (state) => size(state[config.entityName].editedFormNodesErrors) === 0

// override default isValid to include the nodes valid status
const baseValid = Selectors.isValid
Selectors.isValid = (state, props) => {
  return baseValid(state) && Selectors.areNodesValid(state)
}

const getEditedFieldChoices = (state) => {
  const field = Selectors.getEditedField(state)
  if (field) return field.choices
  return null
}

Selectors.buildFormReadyForSave = (formEntity, nodesById, nodesByParentId) => {
  const formData = {...formEntity}
  const nodes = []
  for (let parentId in nodesByParentId) {
    const childrenIds = nodesByParentId[parentId]
    for (let i = 0; i < childrenIds.length; i++) {
      const childNode = {...nodesById[childrenIds[i]]}
      childNode.order = i
      childNode.parentId = parentId
      nodes.push(childNode)
    }
  }
  formData.fields = nodes
  return formData
}

Selectors.getNextChoiceId = createSelector(
  [getEditedFieldChoices],
  (choices) => {
    if (choices === null) return 0

    const ids = map(choices, 'id')
    if (ids.length === 0) return 1
    return max(ids) + 1
  }
)

Selectors.getNextNodeId = createSelector(
  [Selectors.getControls],
  (controlsById) => {
    const ids = map(controlsById, field => {
      const numbers = field.id.substring(1)
      return Number(numbers)
    })
    const id = (ids.length > 0) ? max(ids) + 1 : 1
    return `c${id}`
  }
)

Selectors.buildNewEntity = () => {
  let newEntity = {
    name: 'Nouveau formulaire',
    isArchived: false,
    fields: [
      {id: 'c1', controlType: 'grid', columnCount: 1, order: 0, parentId: 'c0'}
    ]
  }
  return newEntity
}

Selectors.buildNewField = (controlType, id) => {
  const controlConfig = CONTROL_CONFIG_BY_TYPE[controlType]
  const newField = pick(DEFAULT_CONTROL_OPTIONS, controlConfig.properties)
  if (newField.labels) {
    newField.labels = {...newField.labels}
  }
  newField.id = id
  newField.controlType = controlType

  return newField
}

Selectors.buildNewChoice = (id) => {
  const choice = {
    id,
    labels: {
      fr: 'nouveau choix',
      en: 'new choice'
    },
    value: ''
  }
  return choice
}

Selectors.canSaveEditedEntity = (state) => {
  return isEmpty(Selectors.getNodeErrors(state)) &&
    !Selectors.isSubmitting(state)
}

Selectors.getFormSchema = createSelector(
  [Selectors.getControls],
  (fields) => {
    return buildSchemaForFields(fields)
  }
)

export default Selectors
