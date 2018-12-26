import config from './config'
import { getFormValues, getFormError, isValid } from 'redux-form'

const Selectors = {}
Selectors.getChangePasswordForm = getFormValues(config.entityName)
Selectors.canSaveNewPassword = isValid(config.entityName)
Selectors.getChangePasswordError = getFormError(config.entityName)

export default Selectors
