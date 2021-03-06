// import RestService from '../../lib/services/rest-service'
import ApiClient from './base/api-client'
import RestService from './base/rest-service'

import ClientService from './client-service'
import ClientDocumentService from './client-document-service'
import ClientLinkService from './client-link-service'
import AuthService from './authentication-service'
import AccountService from './account-service'
import UploadedFileService from './uploaded-file-service'

export const createService = (serviceName, apiConfig) => {
  const apiClient = new ApiClient(apiConfig)
  switch (serviceName) {
    case 'auth':
      return new AuthService(apiClient)

    case 'accounts':
      return new AccountService(apiClient)

    case 'clients':
      return new ClientService(apiClient)

    case 'client-documents':
      return new ClientDocumentService(apiClient)

    case 'client-links':
      return new ClientLinkService(apiClient)

    case 'form-templates':
      return new RestService('form-templates', apiClient)

    case 'list-options':
      return new RestService('list-options', apiClient)

    case 'client-feed-subscriptions':
      return new RestService('client-feed-subscriptions', apiClient)

    case 'notifications':
      return new RestService('notifications', apiClient)

    case 'form-shortcut':
      return new RestService('form-shortcuts', apiClient)

    case 'uploaded-files':
      return new UploadedFileService(apiClient)

    default:
      throw new Error('Invalid service name', serviceName)
  }
}
