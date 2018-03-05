import config from './config'
const entityName = config.entityName
import {getFormSubmitErrors, getFormSyncErrors, getFormValues, isPristine, isSubmitting, isValid} from 'redux-form'
import {EMPTY_OBJECT} from '../common/selectors'

const Selectors = {}

Selectors.getEditedEntity = getFormValues(entityName)
Selectors.buildNewEntity = (clientId, formId) => {
  let newEntity = {
    clientId,
    formId,
    values: {},
    createdOn: new Date(),
    modifiedOn: new Date()
  }
  return newEntity
}

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

export default Selectors
