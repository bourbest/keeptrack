import config from './config'
import { createSelector } from 'reselect'
import { getLocale } from '../app/selectors'
import {EMPTY_ARRAY, EMPTY_OBJECT} from '../common/selectors'
import {buildSchemaForFields} from '../client-documents/client-document-utils'
import {getNodesById, getOrderedNodesByParentId} from '../form-templates/form-node-utils'

const Selectors = {}
Selectors.getClientForm = state => state[config.entityName].clientForm
Selectors.isFetchingClientForm = state => state[config.entityName].isFetchingClientForm

Selectors.getControlIdsByParentId = createSelector(
  [Selectors.getClientForm],
  (clientForm) => {
    return clientForm ? getOrderedNodesByParentId(clientForm.fields) : EMPTY_OBJECT
  }
)

Selectors.getOrderedRootControlIds = createSelector(
  [Selectors.getControlIdsByParentId],
  (nodesByParentId) => {
    return nodesByParentId['c0'] || EMPTY_ARRAY
  }
)

Selectors.getControls = createSelector(
  [Selectors.getClientForm],
  (clientForm) => {
    return clientForm ? getNodesById(clientForm.fields) : EMPTY_OBJECT
  }
)

Selectors.getClientSchema = createSelector(
  [Selectors.getControls],
  (fields) => {
    return buildSchemaForFields(fields)
  }
)

export const getChoices = (field, locale) => {
  if (field) {
    const ret = {}
    field.choices.forEach(choice => {
      ret[choice.id] = choice.labels[locale]
    })
    return ret
  }
  return EMPTY_OBJECT
}

Selectors.getClientFormMessageOptions = createSelector(
  [Selectors.getControls, getLocale],
  (controlsById, locale) => {
    return getChoices(controlsById['mainPhoneNumber.messageOption'], locale)
  }
)

Selectors.getClientFormOriginOptions = createSelector(
  [Selectors.getControls, getLocale],
  (controlsById, locale) => {
    return getChoices(controlsById['originId'], locale)
  }
)

Selectors.getClientTypeOptions = createSelector(
  [Selectors.getControls, getLocale],
  (controlsById, locale) => {
    return getChoices(controlsById['clientTypeId'], locale)
  }
)
export default Selectors
