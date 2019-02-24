import RestService from './base/rest-service'
const url = 'client-documents'

export default class ClientDocumentService extends RestService {
  constructor (apiClient) {
    super(url, apiClient)
    this.getDocumentsByClientId = this.getDocumentsByClientId.bind(this)
    this.getMyIncompleteDocuments = this.getMyIncompleteDocuments.bind(this)
  }

  getDocumentsByClientId (clientId) {
    const documentsUrl = `${url}?clientId=${clientId}`
    return this.apiClient.get(documentsUrl)
  }

  getMyIncompleteDocuments () {
    const documentsUrl = `${url}/my-incomplete`
    return this.apiClient.get(documentsUrl)
  }
}

