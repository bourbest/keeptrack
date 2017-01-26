import { createActions } from '../helpers/actions'

const prefix = 'APP'

const actions = [
  'SET_API_CONFIG',
  'SET_CSRF_TOKEN',
  'SET_COOKIES'
]

export const Actions = createActions(prefix, actions)

export const ActionCreators = {
  setApiConfig: (config) => ({ type: Actions.SET_API_CONFIG, config }),
  setCsrfToken: (token) => ({ type: Actions.SET_CSRF_TOKEN, token }),
  setCookies: (cookies) => ({ type: Actions.SET_COOKIES, cookies })
}
