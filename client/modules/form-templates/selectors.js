import config, {CONTROL_CONFIG_BY_TYPE, DEFAULT_CONTROL_OPTIONS} from './config'
import {max, map, pick, size} from 'lodash'
import { getFormValues } from 'redux-form'
import { createSelector } from 'reselect'
import { getLocale } from '../app/selectors'
import { createBaseSelectors, createFilteredListSelectorWithLocale, getSortParamsForStringsOnlyTable, makeCompareEntities } from '../common/selectors'

const Selectors = createBaseSelectors(config.entityName)

const concatInfo = (template, locale) => template.name

Selectors.getFilteredList = createFilteredListSelectorWithLocale(Selectors, concatInfo, getLocale)

Selectors.getSortParams = createSelector(
  [Selectors.getSortParams],
  getSortParamsForStringsOnlyTable
)

Selectors.getFilteredSortedList = createSelector(
  [Selectors.getFilteredList, Selectors.getSortParams], (templates, sortParams) => {
    return templates.sort(makeCompareEntities(sortParams))
  }
)

Selectors.getOrderedRootControlIds = (state) => state[config.entityName].editedFormNodesByParentId[0] || []
Selectors.getControlIdsByParentId = (state) => state[config.entityName].editedFormNodesByParentId
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
      childNode.parentId = parseInt(parentId)
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
    const ids = map(controlsById, 'id')
    if (ids.length === 0) return 1
    return max(ids) + 1
  }
)

Selectors.buildNewEntity = () => {
  let newEntity = {
    name: 'Nouveau formulaire',
    isArchived: false,
    fields: [
      {id: 1, controlType: 'grid', columnCount: 1, order: 0, parentId: 0}
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

export default Selectors