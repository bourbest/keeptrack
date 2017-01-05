import RestService from './rest-service'
import ApiClient from './api-client'
import AuthService from './authentication-service'

export {
  RestService,
  ApiClient,
  AuthService
}

export const createService = (serviceName, apiConfig) => {
  const apiClient = new ApiClient(apiConfig)
  switch (serviceName) {
    case 'auth':
      return new AuthService(apiClient)

    case 'client-files':
      return new RestService('client-files', apiClient)

    default:
      throw new Error('Invalid service name', serviceName)
  }
}
