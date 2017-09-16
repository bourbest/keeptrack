// import RestService from '../../lib/services/rest-service'
import ApiClient from './base/api-client'
import AuthService from './authentication-service'
import RestService from './base/rest-service'

export const createService = (serviceName, apiConfig) => {
  const apiClient = new ApiClient(apiConfig)
  switch (serviceName) {
    case 'auth':
      return new AuthService(apiClient)

    case 'accounts':
      return new RestService('accounts', apiClient)

    case 'clients':
      return new RestService('client-files', apiClient)

    case 'form-template':
      return new RestService('form-templates', apiClient)

    default:
      throw new Error('Invalid service name', serviceName)
  }
}
