export default class ClientLinkService {
  constructor (apiClient) {
    this.apiClient = apiClient

    this.getForClientId = this.getForClientId.bind(this)
    this.create = this.create.bind(this)
    this.delete = this.delete.bind(this)
  }

  getForClientId (clientId) {
    const url = `/client-files/${clientId}/client-links`
    return this.apiClient.get(url)
  }

  create (clientId, entity) {
    const url = `/client-files/${clientId}/client-links`
    return this.apiClient.post(url, entity)
  }

  delete (clientId, ids) {
    const url = `/client-files/${clientId}/client-links`
    return this.apiClient.delete(url, ids)
  }
}

