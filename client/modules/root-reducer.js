import { combineReducers } from 'redux'

import clientFile from './client-file/reducer'
import formTemplate from './form-template/reducer'
import auth from './authentication/reducer'
import app from './app/reducer'

export default combineReducers({
  ...clientFile,
  ...formTemplate,
  ...auth,
  ...app
})
