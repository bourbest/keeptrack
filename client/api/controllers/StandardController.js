import {ObjectId} from 'mongodb'
import {isArray, omit, map} from 'lodash'

const removeFieldsFromEntity = (entity, omitFields) => {
  return  omit(entity, omitFields)
}

export const makeFindAllHandler = (Repository, omitFields = []) => {
  return function (req, res, next) {
    const repo = new Repository(req.database)
    const promises = [
      repo.findAll(req.filters, req.pagination),
      repo.count(req.filters)
    ]
    return Promise.all(promises)
      .then(function (data) {
        const entities = map(data[0], entity => removeFieldsFromEntity(entity, omitFields))
        const totalCount = data[1]
        res.result = {
          totalCount,
          entities
        }
        next()
      })
      .catch(next)
  }
}

export const makeFindById = (Repository, omitFields = []) => {
  return function (req, res, next) {
    const repo = new Repository(req.database)
    return repo.findById(req.params.id)
      .then(function (entity) {
        if (entity) {
          const ret = removeFieldsFromEntity(entity, omitFields)
          res.result = ret
          next()
        } else {
          return next({httpStatus: 404, message: 'entity not found'})
        }
        next()
      })
      .catch(next)
  }
}

export const makeHandlePost = (Repository) => {
  return function (req, res, next) {
    const repo = new Repository(req.database)
    const entity = req.entity
    if (!entity.id) {
      entity.id = new ObjectId()
    }
    const now = new Date()
    entity.createdOn = now
    entity.modifiedOn = now

    return repo.insert(entity)
      .then(function () {
        res.result = entity // return untransformed entity so id is used instead of _id
        next()
      })
      .catch(next)
  }
}

export const makeHandlePut = (Repository) => {
  return function (req, res, next) {
    const repo = new Repository(req.database)
    const entity = req.entity

    entity.modifiedOn = new Date()

    return repo.update(entity)
      .then(function (writeResult) {
        res.result = entity // return untransformed entity so id is used instead of _id
        next()
      })
      .catch(next)
  }
}

export const makeHandleArchive = (Repository) => {
  return function (req, res, next) {
    const repo = new Repository(req.database)
    if (!isArray(req.body) || req.body.length === 0) {
      return next({httpStatus: 400, message: 'no ids provided in the body'})
    } else {
      const ids = req.body.map(ObjectId)
      return repo.archive(ids)
        .then(function () {
          res.status(204)
          res.result = '' // no content
          next()
        })
        .catch(next)
    }
  }
}

export const makeHandleRestore = (Repository) => {
  return function (req, res, next) {
    const repo = new Repository(req.database)
    if (!isArray(req.body) || req.body.length === 0) {
      return next({httpStatus: 400, message: 'no ids provided in the body'})
    } else {
      const ids = req.body.map(ObjectId)
      return repo.restore(ids)
        .then(function () {
          res.status(204)
          res.result = '' // no content
          next()
        })
        .catch(next)
    }
  }
}

export const makeHandleDelete = (Repository) => {
  return function (req, res, next) {
    const repo = new Repository(req.database)
    if (!isArray(req.body) || req.body.length === 0) {
      return next({httpStatus: 400, message: 'no ids provided in the body'})
    } else {
      const ids = req.body.map(ObjectId)
      return repo.delete(ids)
        .then(function () {
          res.status(204)
          res.result = '' // no content
          next()
        })
        .catch(next)
    }
  }
}

export function setAuthor (req, res, next) {
  const {entity, user} = req
  entity.ownerId = ObjectId(user.id)
  entity.authorName = user.firstName + ' ' + user.lastName
  entity.authorRole = user.organismRole
  next()
}
