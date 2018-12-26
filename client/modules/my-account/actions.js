import config from './config'
import { createActions } from '../common/actions'

const prefix = config.entityName.toUpperCase()

export const Actions = createActions(prefix, [
  'SUBMIT_CHANGE_PASSWORD'
])

export const ActionCreators = {
  submitChangePassword: (changePasswordForm, cb) => ({type: Actions.SUBMIT_CHANGE_PASSWORD, changePasswordForm, cb})
}
