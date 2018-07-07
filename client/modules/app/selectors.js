import { createService } from '../../services'
import {EMPTY_ARRAY} from '../common/selectors'

export const getApiConfig = (state) => state.app.apiConfig

export const getService = (state, serviceName) => {
  const apiConfig = getApiConfig(state)
  return createService(serviceName, apiConfig)
}

export const getLocale = (state) => state.app.locale

export const getDisplayedModalName = (state) => state.app.displayedModalName

export const getOriginOptions = (state) => state.app.listOptionsByListId['Origine'] || EMPTY_ARRAY

export const getOrganismRoleOptions = (state) => state.app.listOptionsByListId['OrganismRole'] || EMPTY_ARRAY

export const getAppRoleOptions = (state) => state.app.listOptionsByListId['AppRole'] || EMPTY_ARRAY

export const getFetchingActions = (state) => state.app.fetchingActions
