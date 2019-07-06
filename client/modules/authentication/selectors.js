import config from './config'
import ROLES from '../accounts/roles'
import {getFormError, isSubmitting} from 'redux-form'
export const getUser = (state) => state.auth.user
export const getLoginError = getFormError(config.entityName)
export const isAuthenticating = isSubmitting(config.entityName)
export const canSeeClientFileContent = state => {
  const user = getUser(state)
  return user && user.roles.indexOf(ROLES.canInteractWithClient) !== -1
}
