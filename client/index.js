import React from 'react'
import { render } from 'react-dom'
import { match, Router, browserHistory as history } from 'react-router'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import routes from './routes'
import rootSaga from './modules/root-saga'
import configureStore from './store'
import createI18n from './i18n'
import AppConfig from './config'

const lng = AppConfig.defaultLocale

if (lng != null) {
  const store = configureStore(window.__INITIAL_STATE__)

  store.runSaga(rootSaga)

  const i18n = createI18n(lng)
  match({history, routes}, (error, redirect, props) => {
    error = null
    i18n.loadNamespaces(['languages'], function () {
      i18n.on('initialized', function () {
        render(
          <I18nextProvider i18n={i18n}>
            <Provider store={store}>
              <Router {...props} />
            </Provider>
          </I18nextProvider>,
          document.getElementById('mount')
        )
      })
    })
  })
}
