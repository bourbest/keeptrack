
export default class RestService {
  constructor (route, apiClient) {
    this.route = route
    this.apiClient = apiClient

    this.get = this.get.bind(this)
    this.save = this.save.bind(this)
    this.delete = this.delete.bind(this)
  }

  get (id) {
    return this.apiClient.get(this.route, id)
  }

  save (entity, id) {
    id = id || entity.id

    if (id) {
      return this.apiClient.put(this.route, entity, id)
    } else {
      return this.apiClient.post(this.route, entity)
    }
  }

  delete (id) {
    return this.apiClient.delete(this.route, id)
  }
}
