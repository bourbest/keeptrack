import { createService } from '../../services'

export const getApiConfig = (state) => state.app.apiConfig

export const getService = (state, serviceName) => {
  const apiConfig = getApiConfig(state)
  return createService(serviceName, apiConfig)
}

