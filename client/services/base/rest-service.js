import { isArray, map, isObject } from 'lodash'

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

const buildRouteWithFilters = (baseRoute, filterMap) => {
  const filterParams = map(filterMap, (value, key) => `${key}=${encodeURIComponent(value)}`)
  const filterUrl = filterParams.join('&')
  return filterParams.length === 0 ? baseRoute : `${baseRoute}?${filterUrl}`
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

    this.updateEntities = this.updateEntities.bind(this)
    this.createEntities = this.createEntities.bind(this)
  }

  get (id) {
    const transform = this.fromApiTransformer
    return new Promise((resolve, reject) => {
      this.apiClient.get(this.route, id)
        .then((data) => {
          const transformedData = transform ? transformFromApi(data, transform) : data
          resolve(transformedData)
        })
        .catch(reject)
    })
  }

  list (filterMap) {
    const transform = this.fromApiTransformer
    const route = isObject(filterMap) ? buildRouteWithFilters(this.route, filterMap) : this.route

    return new Promise((resolve, reject) => {
      this.apiClient.get(route)
        .then((data) => {
          const transformedData = transform ? transformFromApi(data, transform) : data
          resolve(transformedData)
        })
        .catch(reject)
    })
  }

  save (entity, id, requestHearders) {
    id = id || entity.id

    const transformedData = this.toApiTransformer ? this.toApiTransformer(entity) : entity
    const transform = this.fromApiTransformer
    return new Promise((resolve, reject) => {
      let promise
      if (id) {
        promise = this.apiClient.put(this.route, transformedData, id, requestHearders)
      } else {
        promise = this.apiClient.post(this.route, transformedData, requestHearders)
      }

      promise.then((data) => {
        const transformedData = transform ? transformFromApi(data, transform) : data
        resolve(transformedData)
      }).catch(reject)
    })
  }

  patch (entities, id, requestHearders) {
    const transform = this.fromApiTransformer
    return new Promise((resolve, reject) => {
      this.apiClient.patch(this.route, entities, id, requestHearders)
        .then((data) => {
          const transformedData = transform ? transformFromApi(data, transform) : data
          resolve(transformedData)
        })
        .catch(reject)
    })
  }

  delete (ids, requestHearders) {
    return this.apiClient.delete(this.route, ids, requestHearders)
  }

  updateEntities (entities, requestHearders) {
    const transform = this.fromApiTransformer
    return new Promise((resolve, reject) => {
      this.apiClient.put(this.route, entities, null, requestHearders)
        .then((data) => {
          const transformedData = transform ? transformFromApi(data, transform) : data
          resolve(transformedData)
        })
        .catch(reject)
    })
  }

  createEntities (entities, requestHearders) {
    const transform = this.fromApiTransformer
    return new Promise((resolve, reject) => {
      this.apiClient.post(this.route, entities, null, requestHearders)
        .then((data) => {
          const transformedData = transform ? transformFromApi(data, transform) : data
          resolve(transformedData)
        })
        .catch(reject)
    })
  }
}
