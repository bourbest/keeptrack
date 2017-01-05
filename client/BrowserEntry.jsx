import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { match, Router, browserHistory as history } from 'react-router'

import { ActionCreators as AuthActions } from './redux/modules/authentication'
import { ActionCreators as AppActions } from './redux/modules/app'

import { getService } from './redux/selectors/app-selectors'
import AppConfig from './config'

import configureStore from './redux/store'
import rootSaga from './redux/sagas'
import routes from './routes'

const store = configureStore()

const apiConfig = {
  baseURL: AppConfig.apiEndpoint
}

store.dispatch(AppActions.setApiConfig(apiConfig))
store.runSaga(rootSaga)

const OnResume = (sessionInfo) => {
  if (sessionInfo) {
    store.dispatch(AppActions.setApiHeader('X-CSRF-Token', sessionInfo.csrfToken))
    store.dispatch(AuthActions.setSessionInfo(sessionInfo))
  } else {
    // save target location in cookie before navigating to login page
    // const actualLocation = window.location.pathname
    history.replace('/login')
  }

  match({history, routes}, (error, redirect, props) => {
    error = null
    ReactDOM.render(
      <Provider store={store}>
        <Router {...props} />
      </Provider>,
      document.getElementById('app')
    )
  })
}

const authSvc = getService(store.getState(), 'auth')

authSvc.resume().then(OnResume)
