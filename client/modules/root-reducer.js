import { combineReducers } from 'redux'

import auth from './authentication/reducer'
import app from './app/reducer'
import clients from './clients/reducer'
import clientDocuments from './client-documents/reducer'
import clientLinks from './client-links/reducer'
import accounts from './accounts/reducer'
import formTemplates from './form-templates/reducer'
import clientFeedSubscriptions from './client-feed-subscriptions/reducer'
import notifications from './notifications/reducer'
import dashboard from './dashboard/reducer'
import formShortcuts from './form-shortcut/reducer'
import fileReducer from './uploaded-files/reducer'
import { reducer as formReducer } from 'redux-form'
import {reducer as toastrReducer} from 'react-redux-toastr'

export default combineReducers({
  ...auth,
  ...app,
  ...clients,
  ...clientDocuments,
  ...accounts,
  ...formTemplates,
  ...clientFeedSubscriptions,
  ...notifications,
  ...dashboard,
  ...formShortcuts,
  ...fileReducer,
  ...clientLinks,
  toastr: toastrReducer,
  form: formReducer
})
