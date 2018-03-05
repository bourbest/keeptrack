import RestService from './base/rest-service'
const url = 'client-files'
const docUrl = 'client-documents'

export default class ClientService extends RestService {
  constructor (apiClient) {
    super(url, apiClient)
    this.getDocumentsByClientId = this.getDocumentsByClientId.bind(this)
    this.saveDocument = this.saveDocument.bind(this)
    this.getDocument = this.getDocument.bind(this)
  }

  getDocumentsByClientId (clientId) {
    const documentsUrl = `${url}/${clientId}/documents`
    return this.apiClient.get(documentsUrl)
  }

  getDocument (id) {
    return this.apiClient.get(docUrl, id)
  }

  saveDocument (clientDocument) {
    if (!clientDocument.id) {
      return this.apiClient.post(docUrl, clientDocument)
    } else {
      return this.apiClient.put(docUrl, clientDocument, clientDocument.id)
    }
  }
}

