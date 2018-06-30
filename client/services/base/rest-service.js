import { isArray } from 'lodash'
import {buildUrl} from '../url-utils'

export const transformFromApi = (data, transformFunc) => {
  let ret = data
  if (data) {
    if (isArray(data.content)) {
      data = data.content
    }

    // cette partie supporte deux types de retour, soit un retour sous forme d'array d'entités, et le format object
    // contenant une propriété "content" qui est un array d'entité. Dans les deux cas, on garde la référence obtenue
    // de l'api car elle n'est certainement pas référencée dans le state.
    if (isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        data[i] = transformFunc(data[i])
      }
    } else {
      ret = transformFunc(data)
    }

    return ret
  }
}

// fromApiTransformer: fonction qui modifie l'instance reçue de l'api pour ajuster sa structure pour le reducer
// toApiTransformer : fonction qui transforme la donnée prise du state pour le serveur. Doit retourner un NOUVEL objet

export default class RestService {
  constructor (route, apiClient, fromApiTransformer = null, toApiTransformer = null) {
    this.route = route
    this.apiClient = apiClient
    this.fromApiTransformer = fromApiTransformer
    this.toApiTransformer = toApiTransformer

    this.get = this.get.bind(this)
    this.save = this.save.bind(this)
    this.delete = this.delete.bind(this)
    this.patch = this.patch.bind(this)
    this.list = this.list.bind(this)
  }

  get (id) {
    const transform = this.fromApiTransformer
    return this.apiClient.get(this.route, id)
      .then((data) => {
        const transformedData = transform ? transformFromApi(data, transform) : data
        return transformedData
      })
  }

  list (filtersMap) {
    const transform = this.fromApiTransformer
    const route = buildUrl(this.route, filtersMap)

    return this.apiClient.get(route)
      .then((data) => {
        const transformedData = transform ? transformFromApi(data, transform) : data
        return transformedData
      })
  }

  save (entity, requestHeaders) {
    const id = entity.id

    const transformedData = this.toApiTransformer ? this.toApiTransformer(entity) : entity
    const transform = this.fromApiTransformer
    let promise
    if (id) {
      promise = this.apiClient.put(this.route, transformedData, id, requestHeaders)
    } else {
      promise = this.apiClient.post(this.route, transformedData, requestHeaders)
    }

    return promise.then((data) => {
      const transformedData = transform ? transformFromApi(data, transform) : data
      return transformedData
    })
  }

  patch (entity, id, requestHeaders) {
    const transform = this.fromApiTransformer
    return this.apiClient.patch(this.route, entity, id, requestHeaders)
      .then((data) => {
        const transformedData = transform ? transformFromApi(data, transform) : data
        return transformedData
      })
  }

  delete (ids, requestHeaders) {
    return this.apiClient.delete(this.route, ids, requestHeaders)
  }
}
