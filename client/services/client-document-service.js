import RestService from './base/rest-service'
const url = 'client-documents'

export default class ClientService extends RestService {
  constructor (apiClient) {
    super(url, apiClient)
    this.getDocumentsByClientId = this.getDocumentsByClientId.bind(this)
  }

  getDocumentsByClientId (clientId) {
    const documentsUrl = `${url}?clientId=${clientId}`
    return this.apiClient.get(documentsUrl)
  }
}

