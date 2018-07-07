import RestService from './base/rest-service'
const url = 'client-files'
const docUrl = 'client-documents'

export default class ClientService extends RestService {
  constructor (apiClient) {
    super(url, apiClient)
    this.getDocumentsByClientId = this.getDocumentsByClientId.bind(this)
    this.saveDocument = this.saveDocument.bind(this)
    this.getDocument = this.getDocument.bind(this)
    this.findByNameStartingWith = this.findByNameStartingWith.bind(this)
  }

  getDocumentsByClientId (clientId) {
    const documentsUrl = `${docUrl}?clientId=${clientId}`
    return this.apiClient.get(documentsUrl)
  }

  getEvolutionNotesByClientId (clientId) {
    const documentsUrl = `${url}/${clientId}/evolution-notes`
    return this.apiClient.get(documentsUrl)
  }

  getDocument (id) {
    return this.apiClient.get(docUrl, id)
  }

  saveDocument (clientDocument) {
    if (!clientDocument.id) {
      return this.apiClient.post(docUrl, clientDocument, null)
    } else {
      return this.apiClient.put(docUrl, clientDocument, clientDocument.id)
    }
  }

  findByNameStartingWith (startsWith, limit) {
    const query = `${url}?contains=${encodeURIComponent(startsWith)}&limit=${limit}&sortby=fullname`
    return this.apiClient.get(query)
  }
}

