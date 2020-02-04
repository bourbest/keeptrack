import {omit, isArray, trim, identity} from 'lodash'
import {ObjectId} from 'mongodb'
export const convertPaginationToMongoOptions = (pagination) => {
  if (pagination) {
    const ret = {}
    if (pagination.limit) {
      ret.limit = pagination.limit

      if (pagination.page) {
        ret.skip = (pagination.page - 1) * pagination.limit
      }
    }

    if (pagination.sortby) {
      const direction = pagination.sortdirection === 'desc' ? -1 : 1
      ret.sort = {[pagination.sortby]: direction}
    }
    return ret
  }
  return null
}

function getEndStr (str) {
  const endStrArr = str.split('')
  for (let i = endStrArr.length - 1; i >= 0; --i) {
    let lastChar = endStrArr[i]
    let nextChar = String.fromCharCode(lastChar.charCodeAt(0) + 1)
    if (nextChar === ':') {
      nextChar = 'a'
    }

    if (nextChar !== false) {
      endStrArr[i] = nextChar
      return endStrArr.join('')
    }
    endStrArr.pop()
  }
}

export function addStartsWithCriteria (searchCriteria, propertyName, str) {
  str = trim(str).toLowerCase()
  const endStr = getEndStr(str)
  if (endStr) {
    if (!searchCriteria.$and) {
      searchCriteria.$and = []
    }
    searchCriteria.$and.push({[propertyName]: {$gte: str}})
    searchCriteria.$and.push({[propertyName]: {$lt: endStr}})
  } else {
    searchCriteria[propertyName] = {$gte: str}
  }
}

export const convertFromDatabase = (entity) => {
  if (isArray(entity)) {
    return entity.map(convertFromDatabase)
  } else if (entity) {
    const ret = omit(entity, '_id')
    ret.id = entity._id
    return ret
  }
  return null
}

export const prepareForDatabase = (entity) => {
  if (isArray(entity)) {
    return entity.map(prepareForDatabase)
  }

  const ret = omit(entity, 'id')
  ret._id = entity.id

  return ret
}

export function findAll (filters, pagination = null) {
  filters = filters || {}
  const options = convertPaginationToMongoOptions(pagination)
  const mongoFilters = this.convertFilters(filters)

  return this.collection.find(mongoFilters, options)
    .collation({locale: 'fr', strength: 2})
    .toArray()
    .then(this.convertFromDatabase)
}

export function count (filters) {
  filters = filters || {}
  const mongoFilters = this.convertFilters(filters)

  return this.collection.find(mongoFilters)
    .collation({locale: 'fr', strength: 2})
    .count()
}

export function findById (id) {
  const filters = {_id: ObjectId(id)}
  return this.collection.findOne(filters)
    .then(this.convertFromDatabase)
}

export function findByIds (ids) {
  const convertedIds = ids.map(ObjectId)
  const filters = {_id: {$in: convertedIds}}
  return this.collection.find(filters)
    .toArray()
    .then(this.convertFromDatabase)
}

export function insert (entity) {
  const data = this.prepareForDatabase(entity)
  return this.collection.insertOne(data)
}

export function insertMany (entities) {
  const data = this.prepareForDatabase(entities)
  return this.collection.insertMany(entities)
}

export function update (entity) {
  const data = this.prepareForDatabase(entity)
  const filters = {_id: data._id}
  return this.collection.replaceOne(filters, data)
}

export function upsert (entity) {
  const data = this.prepareForDatabase(entity)
  const filters = {_id: data.id}
  return this.collection.replaceOne(filters, data, {upsert: true})
}

export function archive (ids) {
  const filters = {_id: {$in: ids}}
  const update = {
    $set: {isArchived: true}
  }

  return this.collection.updateMany(filters, update)
}

export function restore (ids) {
  const filters = {_id: {$in: ids}}
  const update = {
    $set: {isArchived: false}
  }

  return this.collection.updateMany(filters, update)
}

export function deleteByIds (ids) {
  const filters = {_id: {$in: ids}}

  return this.collection.deleteMany(filters)
}

export function deleteByFilters (filters) {
  return this.collection.deleteMany(filters)
}

export const createBaseRepository = (collectionName) => {
  function BaseRepository (db) {
    this.collection = db.collection(collectionName)
  }

  BaseRepository.prototype.findAll = findAll
  BaseRepository.prototype.findById = findById
  BaseRepository.prototype.insert = insert
  BaseRepository.prototype.insertMany = insertMany
  BaseRepository.prototype.update = update
  BaseRepository.prototype.upsert = upsert
  BaseRepository.prototype.findByIds = findByIds
  BaseRepository.prototype.archive = archive
  BaseRepository.prototype.restore = restore
  BaseRepository.prototype.delete = deleteByIds
  BaseRepository.prototype.deleteByFilters = deleteByFilters
  BaseRepository.prototype.convertFilters = identity
  BaseRepository.prototype.convertFromDatabase = convertFromDatabase
  BaseRepository.prototype.prepareForDatabase = prepareForDatabase
  BaseRepository.prototype.count = count

  return BaseRepository
}
