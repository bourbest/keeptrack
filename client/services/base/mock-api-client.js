import { has, cloneDeep, keyBy, maxBy, keys, omit, findIndex } from 'lodash'

export const fakeCall = (duration, isSuccess, data) => {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      if (isSuccess) {
        resolve(data)
      } else {
        reject(data)
      }
    }, duration)
  })
}

export class MockApiClient {
  constructor (db, keyName = 'id') {
    this.db = db
    this.dbById = keyBy(db, keyName)
    this.keyName = keyName

    this.nextId = parseInt(maxBy(keys(this.dbById))) + 1
    this.get = this.get.bind(this)
    this.save = this.save.bind(this)
    this.delete = this.delete.bind(this)
  }

  get (url, id, callHeaders) {
    let data = null
    let success = false
    if (id) {
      if (has(this.dbById, id)) {
        success = true
        data = cloneDeep(this.dbById[id])
      }
    } else {
      success = true
      data = cloneDeep(this.db)
    }

    return fakeCall(100, success, data)
  }

  put (url, data, id, callHeaders) {
    return this.save(data, id)
  }

  patch (url, data, id, callHeaders) {
    return this.save(data, id)
  }

  post (url, data, callHeaders) {
    return this.save(data)
  }

  save (entity, id) {
    const copy = cloneDeep(entity)
    id = id || entity[this.keyName]

    if (!id) {
      id = this.nextId++
      copy[this.keyName] = id
      this.dbById[id] = copy
      this.db.push(copy)
    } else {
      updateObject(this.dbById[id], copy)
    }
    return fakeCall(100, true, copy)
  }

  delete (url, ids, callHeaders) {
    this.dbById = omit(this.dbById, ids)
    ids.forEach((id) => {
      const index = findIndex(this.db, {'id': id})
      if (index >= 0) {
        delete this.db.splice(index, 1)
      }
    })
    return fakeCall(100, true, null)
  }
}

function updateObject (dest, source) {
  for (let prop in source) {
    dest[prop] = source[prop]
  }
}
