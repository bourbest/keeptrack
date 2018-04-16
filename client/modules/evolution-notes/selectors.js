import config from './config'
const branch = config.entityName
import {getFormValues, isValid} from 'redux-form'
const Selectors = {}
Selectors.buildNewEntity = () => {
  let newEntity = {
    note: '',
    duration: '',
    clientId: null
  }
  return newEntity
}

Selectors.canSave = isValid(branch)
Selectors.getSelectedClient = (state) => state[branch].client
Selectors.getEditedNote = getFormValues(branch)

export default Selectors
