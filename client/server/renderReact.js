import React from 'react'

import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import HTMLDocument, { doctype } from './HTMLTemplate'
import jwtDecode from 'jwt-decode'

import rootSaga from '../modules/root-saga'
import configureStore from '../store'

import { ActionCreators as AppActions } from '../modules/app/actions'
import { ActionCreators as AuthActions } from '../modules/authentication/actions'

import { I18nextProvider } from 'react-i18next'
import { getUser } from '../modules/authentication/selectors'
import createI18n from '../i18n-server'
import AuthConfig from '../modules/authentication/config'
import {COOKIE_NAMES} from '../config/const'

function renderApplication (props) {
  return doctype + renderToStaticMarkup(<HTMLDocument {...props} />)
}

let i18nMap = createI18n()

function deserializeTicket (ticket) {
  if (!ticket || ticket === '') {
    return null
  }

  return jwtDecode(ticket)
}

export default function (request, res, props, context) {
  // console.log should be avoided for high traffic server as it is a blocking call
  console.log('url', request.url)
  const config = context.configuration
  const apiConfig = {
    baseURL: config.apiEndpoint
  }
  const lng = config.defaultLocale
  const store = configureStore()
  const authCookie = request.cookies[COOKIE_NAMES.auth] || ''
  const csrfToken = request.cookies[COOKIE_NAMES.csrfToken] || ''

  // redirects to /login if user is not authenticated
  if (!request.url.startsWith('/login') && (authCookie === '' || csrfToken === '')) {
    let redir = '/login'
    if (request.url !== '/login') {
      const target = encodeURIComponent(request.url)
      redir = `/login?ret=${target}`
    }
    res.redirect(redir)
    return
  }
  const cookies = `${COOKIE_NAMES.auth}=${authCookie}; ${COOKIE_NAMES.csrfToken}=${csrfToken};`

  // prepare state
  store.dispatch(AppActions.setApiConfig(apiConfig))
  store.dispatch(AppActions.setLocale(lng))
  store.dispatch(AppActions.setCookies(cookies))
  store.dispatch(AppActions.setCsrfToken(csrfToken))
  store.dispatch(AuthActions.setUser(deserializeTicket(authCookie)))

  const rootComponent = (
    <I18nextProvider i18n={i18nMap[lng]}>
      <Provider store={store}>
        <RouterContext {...props} />
      </Provider>
    </I18nextProvider>
  )
  const run = store.runSaga(rootSaga).done
  store.dispatch(AppActions.loadLists())

  // Trigger sagas for component to run
  // https://github.com/yelouafi/redux-saga/issues/255#issuecomment-210275959
  renderToString(rootComponent)

  run.then(() => {
    const csrfToken = request.csrf.generateToken(request, res)
    const state = {...store.getState()}
    try {
      const html = renderToString(rootComponent)
      state.app.apiConfig.headers = {  // remove the cookies from the state before rendering so they do not appear on the client
        'X-CSRF-Token': csrfToken
      }
      const htmlApp = renderApplication({
        state,
        html,
        scripts: context.scripts,
        runtime: context.runtime
      })
      res.send(htmlApp)
    } catch (err) {
      console.log(err)
      res.send(err.stack)
    }
  })

  // Dispatch a close event so sagas stop listening after they're resolved
  store.close()
}
