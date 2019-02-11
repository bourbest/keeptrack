import config, {DocumentStatus} from './config'
const entityName = config.entityName

import {getFormSubmitErrors, getFormSyncErrors, getFormValues, isPristine, isSubmitting, isValid} from 'redux-form'
import {createSelector} from 'reselect'
import {EMPTY_OBJECT} from '../common/selectors'
import {getLocale} from '../app/selectors'
import { DocumentStatusOptions } from '../form-templates/config'
import {translate} from '../../locales/translate'
const Selectors = {}

Selectors.getEditedEntity = getFormValues(entityName)
Selectors.buildNewEntity = (template, clientId) => {
  let newEntity = {
    clientId,
    status: template.documentStatus === DocumentStatusOptions.USE_DRAFT ? DocumentStatus.DRAFT : DocumentStatus.COMPLETE,
    formId: template.id,
    values: {},
    createdOn: new Date(),
    modifiedOn: new Date(),
    documentDate: new Date(),
    isArchived: false
  }

  return newEntity
}

Selectors.getClient = state => state[entityName].client

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

export default Selectors
