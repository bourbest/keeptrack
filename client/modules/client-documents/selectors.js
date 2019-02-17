import config, {DocumentStatus} from './config'
const entityName = config.entityName

import {getFormSubmitErrors, getFormSyncErrors, getFormValues, isPristine, isSubmitting, isValid} from 'redux-form'
import {createSelector} from 'reselect'
import {EMPTY_ARRAY, EMPTY_OBJECT} from '../common/selectors'
import {getLocale} from '../app/selectors'
import {translate} from '../../locales/translate'
import {buildSchemaForDocument, buildDocumentWithDefaultValues} from './client-document-utils'
import {getNodesById, getOrderedNodesByParentId} from '../form-templates/form-node-utils'

const Selectors = {}

Selectors.getEditedEntity = getFormValues(entityName)
Selectors.buildNewEntity = (template, clientId) => {
  return buildDocumentWithDefaultValues(template, clientId)
}

Selectors.getClient = state => state[entityName].client
Selectors.getTemplate = state => state[entityName].formTemplate
Selectors.isFetching = state => state[entityName].isFetching

Selectors.getSubmitError = getFormSubmitErrors(entityName)
Selectors.getSyncErrors = getFormSyncErrors(entityName)
Selectors.isSubmitting = isSubmitting(entityName)
Selectors.isNewEntity = (state) => {
  const entity = Selectors.getEditedEntity(state) || EMPTY_OBJECT
  return !entity.id
}
Selectors.isPristine = isPristine(entityName)
Selectors.isValid = isValid(entityName)

Selectors.canSaveEditedEntity = (state) => {
  return !Selectors.isPristine(state) &&
    Selectors.isValid(state) &&
    !Selectors.isSubmitting(state)
}

Selectors.getStatusOptions = createSelector(
  [getLocale],
  (locale) => {
    return [
      {id: DocumentStatus.DRAFT, label: translate('client-document.statusOptions.draft', locale)},
      {id: DocumentStatus.COMPLETE, label: translate('client-document.statusOptions.complete', locale)}
    ]
  }
)

Selectors.getControlIdsByParentId = createSelector(
  [Selectors.getTemplate],
  (template) => {
    return template ? getOrderedNodesByParentId(template.fields) : EMPTY_OBJECT
  }
)

Selectors.getOrderedRootControlIds = createSelector(
  [Selectors.getControlIdsByParentId],
  (nodesByParentId) => {
    return nodesByParentId['c0'] || EMPTY_ARRAY
  }
)

Selectors.getControls = createSelector(
  [Selectors.getTemplate],
  (template) => {
    return template ? getNodesById(template.fields) : EMPTY_OBJECT
  }
)

Selectors.getFormSchema = createSelector(
  [Selectors.getTemplate],
  (template) => {
    if (template) return buildSchemaForDocument(template)
    return EMPTY_OBJECT
  }
)

export default Selectors
