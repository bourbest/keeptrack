import {MockApiClient} from './mock-api-client'

export class MockService {
  constructor (db, keyName = 'id') {
    this.apiClient = new MockApiClient(db, keyName)

    this.get = this.get.bind(this)
    this.save = this.save.bind(this)
    this.delete = this.delete.bind(this)
  }

  get (id) {
    return this.apiClient.get(null, id)
  }

  save (entity, id) {
    id = id || entity.id
    if (id) {
      return this.apiClient.put(null, entity, id)
    } else {
      return this.apiClient.post(null, entity)
    }
  }

  delete (ids) {
    return this.apiClient.delete(null, ids)
  }
}
