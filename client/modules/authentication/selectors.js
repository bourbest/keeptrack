import config from './config'
import {getFormError, isSubmitting} from 'redux-form'
export const getUser = (state) => state.auth.user
export const getLoginError = getFormError(config.entityName)
export const isAuthenticating = isSubmitting(config.entityName)
