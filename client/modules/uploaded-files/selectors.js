import config from './config'
import { getFormValues, getFormError, isValid } from 'redux-form'

const Selectors = {}
Selectors.getFileInfoForm = getFormValues(config.entityName)
Selectors.canSaveFileInfo = isValid(config.entityName)
Selectors.getFileInfoError = getFormError(config.entityName)

export default Selectors
