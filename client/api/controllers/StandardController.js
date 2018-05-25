import {ObjectId} from 'mongodb'
import {isArray} from 'lodash'

export const makeFindAllHandler = (Repository) => {
  return function (req, res, next) {
    const repo = new Repository(req.database)
    return repo.findAll(req.filters, req.pagination)
      .then(function (entities) {
        res.json(entities)
      })
      .catch(next)
  }
}

export const makeFindById = (Repository) => {
  return function (req, res, next) {
    const repo = new Repository(req.database)
    return repo.findById(req.params.id)
      .then(function (entity) {
        if (entity) {
          res.json(entity)
        } else {
          res.status(404).json({error: 'entity not found'})
        }
      })
      .catch(next)
  }
}

export const makeHandlePost = (Repository) => {
  return function (req, res, next) {
    const repo = new Repository(req.database)
    const entity = req.entity
    entity.id = new ObjectId()
    const now = new Date()
    entity.createdOn = now
    entity.modifiedOn = now

    return repo.insert(entity)
      .then(function () {
        res.json(entity) // return untransformed entity so id is used instead of _id
      })
      .catch(next)
  }
}

export const makeHandlePut = (Repository) => {
  return function (req, res, next) {
    const repo = new Repository(req.database)
    const entity = req.entity
    entity.id = ObjectId(req.params.id)
    entity.modifiedOn = new Date()

    return repo.update(entity)
      .then(function () {
        res.json(entity) // return untransformed entity so id is used instead of _id
      })
      .catch(next)
  }
}

export const makeHandleDelete = (Repository) => {
  return function (req, res, next) {
    const repo = new Repository(req.database)
    if (!isArray(req.body) || req.body.length === 0) {
      res.status(400).json({error: 'no ids provided in the body'})
    } else {
      const ids = req.body.map(ObjectId)
      return repo.archive(ids)
        .then(function () {
          res.status(204).send('') // no content
        })
        .catch(next)
    }
  }
}
