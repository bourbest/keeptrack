import { combineReducers } from 'redux'

import clientFile from './client-file'
import auth from './authentication'
import app from './app'

export default combineReducers({
  clientFile,
  auth,
  app
})
