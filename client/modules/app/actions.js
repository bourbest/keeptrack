import { END } from 'redux-saga'
import { createActions } from '../common/actions'

const prefix = 'APP'

const actions = [
  'SET_API_CONFIG',
  'SET_CSRF_TOKEN',
  'SET_COOKIES',
  'SET_LOCALE',
  'NOTIFY',
  'SHOW_MODAL',
  'HIDE_MODAL',

  'LOAD_LISTS',
  'SET_LISTS_OPTIONS',

  'SET_FETCHING_ACTIONS',
  'SET_RENDERING_APP'
]

export const Actions = createActions(prefix, actions)

export const ActionCreators = {
  setApiConfig: (config) => ({type: Actions.SET_API_CONFIG, config}),
  setCsrfToken: (token) => ({type: Actions.SET_CSRF_TOKEN, token}),
  setCookies: (cookies) => ({type: Actions.SET_COOKIES, cookies}),
  setLocale: (locale) => ({type: Actions.SET_LOCALE, locale}),
  notify: (title, message, params = {}, isError = false) => ({type: Actions.NOTIFY, title, message, params, isError}),

  showModal: (modalName) => ({ type: Actions.SHOW_MODAL, modalName }),
  hideModal: () => ({ type: Actions.HIDE_MODAL }),

  loadLists: () => ({ type: Actions.LOAD_LISTS }),
  setListsOptions: (options) => ({ type: Actions.SET_LISTS_OPTIONS, options }),

  setFetchingActions: (fetchingActions) => ({type: Actions.SET_FETCHING_ACTIONS, fetchingActions}),

  // this action is dispatched by the renderReact file to ensure all pages have at least one "isFetching"
  // that will be caught by the watchFetchingActions saga. This ensures the closeSaga action is always called
  // even when the container does not have any fetch. The param name isFetching is important as
  // the watchFetchingActions saga looks precisely for that parameter
  setRenderingApp: (isFetching) => ({type: Actions.SET_RENDERING_APP, isFetching})
}

if (process.env.target === 'server') {
  ActionCreators.closeSaga = () => END
} else {
  ActionCreators.closeSaga = () => ({type: ''})
}
