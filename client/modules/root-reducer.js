import { combineReducers } from 'redux'

import auth from './authentication/reducer'
import app from './app/reducer'
import clients from './clients/reducer'

import { reducer as formReducer } from 'redux-form'
import {reducer as toastrReducer} from 'react-redux-toastr'

export default combineReducers({
  ...auth,
  ...app,
  ...clients,
  toastr: toastrReducer,
  form: formReducer
})
