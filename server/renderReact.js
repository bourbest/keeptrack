import React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import HTMLDocument, { doctype } from './HTMLTemplate'

import rootSaga from '../client/redux/sagas'
import configureStore from '../client/redux/store'

import AppConfig from '../client/config'
import { ActionCreators as AppActions } from '../client/redux/modules/app'
import { ActionCreators as AuthActions } from '../client/redux/modules/authentication'

function renderApplication (props) {
  return doctype + renderToStaticMarkup(<HTMLDocument {...props} />)
}

const apiConfig = {
  baseURL: AppConfig.apiEndpoint
}

export default function (request, res, props) {
  console.log('url', request.url)

  const store = configureStore()
  const authCookie = request.cookies['KT-Auth'] || ''
  const csrfToken = request.cookies['KT-CSRF'] || ''

  if (!request.url.startsWith('/login') && (authCookie === '' || csrfToken === '')) {
    let redir = '/login'
    if (request.url !== '/login') {
      const target = encodeURIComponent(request.url)
      redir = `/login?ret=${target}`
    }
    res.redirect(redir)
  } else {
    const cookies = `KT-Auth=${authCookie}; KT-CSRF=${csrfToken};`

    store.dispatch(AppActions.setApiConfig(apiConfig))
    store.dispatch(AppActions.setCookies(cookies))
    store.dispatch(AppActions.setCsrfToken(csrfToken))

    store.dispatch(AuthActions.setTicket(authCookie))

    const rootComponent = (
      <Provider store={store}>
        <RouterContext {...props} />
      </Provider>
    )

    store.runSaga(rootSaga).done.then(() => {
      const state = {...store.getState()}
      const html = renderToString(rootComponent)

      state.app.apiConfig.headers = {  // remove the cookies from the state before rendering so they do not appear on the client
        'X-CSRF-Token': csrfToken
      }

      res.send(renderApplication({state, html}))
    })

    // Trigger sagas for component to run
    // https://github.com/yelouafi/redux-saga/issues/255#issuecomment-210275959
    renderToString(rootComponent)

    // Dispatch a close event so sagas stop listening after they're resolved
    store.close()
  }
}
