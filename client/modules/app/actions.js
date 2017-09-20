import { createActions } from '../common/actions'

const prefix = 'APP'

const actions = [
  'SET_API_CONFIG',
  'SET_CSRF_TOKEN',
  'SET_COOKIES',
  'SET_LOCALE',
  'NOTIFY',
  'SHOW_MODAL',
  'HIDE_MODAL'
]

export const Actions = createActions(prefix, actions)

export const ActionCreators = {
  setApiConfig: (config) => ({type: Actions.SET_API_CONFIG, config}),
  setCsrfToken: (token) => ({type: Actions.SET_CSRF_TOKEN, token}),
  setCookies: (cookies) => ({type: Actions.SET_COOKIES, cookies}),
  setLocale: (locale) => ({type: Actions.SET_LOCALE, locale}),
  notify: (title, message, params = {}, isError) => ({type: Actions.NOTIFY, title, message, params, isError}),

  showModal: (modalName) => ({ type: Actions.SHOW_MODAL, modalName }),
  hideModal: () => ({ type: Actions.HIDE_MODAL })
}

