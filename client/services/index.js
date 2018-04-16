// import RestService from '../../lib/services/rest-service'
import ApiClient from './base/api-client'
import RestService from './base/rest-service'

import ClientService from './client-service'
import AuthService from './authentication-service'
import AccountService from './account-service'

export const createService = (serviceName, apiConfig) => {
  const apiClient = new ApiClient(apiConfig)
  switch (serviceName) {
    case 'auth':
      return new AuthService(apiClient)

    case 'accounts':
      return new AccountService(apiClient)

    case 'clients':
      return new ClientService(apiClient)

    case 'form-templates':
      return new RestService('form-templates', apiClient)

    case 'list-options':
      return new RestService('list-options', apiClient)

    case 'evolution-notes':
      return new RestService('evolution-notes', apiClient)

    default:
      throw new Error('Invalid service name', serviceName)
  }
}
