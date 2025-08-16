export default class ClientLinkService {
  constructor (apiClient) {
    this.apiClient = apiClient

    this.getForUserId = this.getForUserId.bind(this)
    this.create = this.create.bind(this)
    this.delete = this.delete.bind(this)
  }

  getForUserId (userId) {
    const url = `/accounts/${userId}/blocked-files`
    return this.apiClient.get(url)
  }

  create (userId, entity) {
    const url = `/accounts/${userId}/blocked-files`
    return this.apiClient.post(url, entity)
  }

  delete (userId, ids) {
    const url = `/accounts/${userId}/blocked-files`
    return this.apiClient.delete(url, ids)
  }
}

