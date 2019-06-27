import config from './config'
import { getFormValues, getFormError, isValid } from 'redux-form'

const Selectors = {}
Selectors.getFilesForm = getFormValues(config.entityName)
Selectors.canSaveFileInfo = isValid(config.entityName)
Selectors.getFileInfoError = getFormError(config.entityName)

Selectors.getUploadProgresses = state => state[config.entityName].uploadProgresses

export default Selectors
