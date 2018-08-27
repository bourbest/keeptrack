import {ClientRepository, EvolutionNoteRepository, ClientFeedSubcriptionRepository} from '../repository'
import {
  makeFindAllHandler, makeFindById, makeHandleArchive, makeHandlePost, makeHandlePut,
  makeHandleRestore
} from './StandardController'
import {entityFromBody, parsePagination, parseFilters} from '../middlewares'
import {clientSchema} from '../../modules/clients/schema'

import {string, boolean, Schema} from 'sapin'
import {isArray} from 'lodash'
import {ObjectId} from 'mongodb'

const filtersSchema = new Schema({
  contains: string,
  isArchived: boolean
})

function getDocumentsByClientId (Repository) {
  return function (req, res, next) {
    const repo = new Repository(req.database)
    return repo.findByClientId(req.params.id)
      .then(function (entity) {
        res.json(entity)
      })
      .catch(next)
  }
}

function deleteFeedSubscriptions (req, res, next) {
  if (!isArray(req.body) || req.body.length === 0) {
    res.status(400).json({error: 'no ids provided in the body'})
  } else {
    const repo = new ClientFeedSubcriptionRepository(req.database)
    const ids = req.body.map(ObjectId)
    return repo.deleteByClientIds(ids)
      .then(function () {
        next()
      })
      .catch(next)
  }
}

const ACCEPTED_SORT_PARAMS = ['fullName']

export default (router) => {
  router.use('/client-files', entityFromBody(clientSchema))
  router.route('/client-files')
    .get([
      parsePagination(ACCEPTED_SORT_PARAMS),
      parseFilters(filtersSchema),
      makeFindAllHandler(ClientRepository)
    ])
    .post(makeHandlePost(ClientRepository))
    .delete(makeHandleArchive(ClientRepository))

  router.route('/client-files/archive')
    .post([
      deleteFeedSubscriptions,
      makeHandleArchive(ClientRepository)
    ])

  router.route('/client-files/restore')
    .post(makeHandleRestore(ClientRepository))

  router.route('/client-files/:id')
    .get(makeFindById(ClientRepository))
    .put(makeHandlePut(ClientRepository))

  router.route('/client-files/:id/evolution-notes')
    .get(getDocumentsByClientId(EvolutionNoteRepository))
}
