import { combineReducers } from 'redux'

import auth from './authentication/reducer'
import app from './app/reducer'
import clients from './clients/reducer'
import accounts from './accounts/reducer'
import formTemplates from './form-templates/reducer'
import evolutionNote from './evolution-notes/reducer'
import { reducer as formReducer } from 'redux-form'
import {reducer as toastrReducer} from 'react-redux-toastr'

export default combineReducers({
  ...auth,
  ...app,
  ...clients,
  ...accounts,
  ...formTemplates,
  ...evolutionNote,
  toastr: toastrReducer,
  form: formReducer
})
