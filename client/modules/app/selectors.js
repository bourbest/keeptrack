import { createService } from '../../services'
import {EMPTY_ARRAY} from '../common/selectors'

export const getApiConfig = (state) => state.app.apiConfig

export const getService = (state, serviceName) => {
  const apiConfig = getApiConfig(state)
  return createService(serviceName, apiConfig)
}

export const getLocale = (state) => state.app.locale

export const getDisplayedModalName = (state) => state.app.displayedModalName

export const getListOptions = (state, listName) => state.app.listOptionsByListId[listName] || EMPTY_ARRAY
