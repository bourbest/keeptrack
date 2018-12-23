import { combineReducers } from 'redux'

import auth from './authentication/reducer'
import app from './app/reducer'
import clients from './clients/reducer'
import accounts from './accounts/reducer'
import formTemplates from './form-templates/reducer'
import evolutionNote from './evolution-notes/reducer'
import clientFeedSubscriptions from './client-feed-subscriptions/reducer'
import notifications from './notifications/reducer'
import dashboard from './dashboard/reducer'
import reports from './reports/reducer'
import { reducer as formReducer } from 'redux-form'
import {reducer as toastrReducer} from 'react-redux-toastr'

export default combineReducers({
  ...auth,
  ...app,
  ...clients,
  ...accounts,
  ...formTemplates,
  ...evolutionNote,
  ...clientFeedSubscriptions,
  ...notifications,
  ...dashboard,
  ...reports,
  toastr: toastrReducer,
  form: formReducer
})
