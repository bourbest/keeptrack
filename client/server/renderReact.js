import React from 'react'

import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import HTMLDocument, { doctype } from './HTMLTemplate'

import rootSaga from '../modules/root-saga'
import configureStore from '../store'

import AppConfig from '../config'

import { ActionCreators as AppActions } from '../modules/app/actions'
import { ActionCreators as AuthActions } from '../modules/authentication/actions'

import { I18nextProvider } from 'react-i18next'
import { getUser } from '../modules/authentication/selectors'
import createI18n from '../i18n-server'
import AuthConfig from '../modules/authentication/config'

function renderApplication (props) {
  return doctype + renderToStaticMarkup(<HTMLDocument {...props} />)
}

const apiConfig = {
  baseURL: AppConfig.apiEndpoint
}

let i18nMap = createI18n()

export default function (request, res, props, context) {
  // console.log should be avoided for high traffic server as it is a blocking call
  console.log('url', request.url)
  const lng = AppConfig.defaultLocale
  const store = configureStore()
  const authCookie = request.cookies[AppConfig.cookieNames.auth] || ''
  const csrfToken = request.cookies[AppConfig.cookieNames.csrfToken] || ''

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
  const cookies = `${AppConfig.cookieNames.auth}=${authCookie}; ${AppConfig.cookieNames.csrfToken}=${csrfToken};`

  // prepare state
  store.dispatch(AppActions.setApiConfig(apiConfig))
  store.dispatch(AppActions.setLocale(lng))
  store.dispatch(AppActions.setCookies(cookies))
  store.dispatch(AppActions.setCsrfToken(csrfToken))
  store.dispatch(AuthActions.setTicket(authCookie))

  // Si on est au slash et authentifié, on redirige vers la page par défault authentifié
  if (request.url === '' || request.url === '/') {
    const user = getUser(store.getState())
    if (user && user.defaultCatalogId) {
      const redir = AuthConfig.defaultAuthenticatedPage(user.defaultCatalogId)
      res.redirect(redir)
      return
    }
  }

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
