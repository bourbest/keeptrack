import {ClientRepository, EvolutionNoteRepository, ClientFeedSubcriptionRepository, FormTemplateRepository} from '../repository'
import {
  makeFindAllHandler, makeFindById, makeHandleArchive, makeHandlePost, makeHandlePut,
  makeHandleRestore
} from './StandardController'
import {parsePagination, parseFilters} from '../middlewares'
import {buildSchemaForFields} from '../../modules/form-templates/dynamic-form-validation'

import {string, boolean, Schema, validate, transform} from 'sapin'
import {isArray} from 'lodash'
import {ObjectId} from 'mongodb'
import { CLIENT_FORM_ID } from '../../modules/const'

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

function getUserSubscribedClients (req, res, next) {
  const repo = new ClientFeedSubcriptionRepository(req.database) 
  repo.getClientsSubscribedForUserId(req.user.id)
    .then(function (clients) {
      res.json(clients)
    })
    .catch(next)
}

function getEmailDistributionList (req, res, next) {
  const repo = new ClientRepository(req.database)
  repo.getEmailDistributionList()
    .then(function (list) {
      res.json(list)
    })
    .catch(next)
}

function validateClient (req, res, next) {
  const formsRepo = new FormTemplateRepository(req.database)
  formsRepo.findById(CLIENT_FORM_ID)
    .then(formTemplate => {
      if (!formTemplate) {
        return next({httpStatus: 500, message: 'System Client Form Template not found'})
      }
      const schema = buildSchemaForFields(formTemplate.fields, true)
      const errors = validate(req.body, schema)
      if (errors) {
        return next({httpStatus: 400, message: 'Document does does not respect Form Schema', errors})
      }
      req.entity = transform(req.body, schema)
      next()
    })
    .catch(next)
}

const ACCEPTED_SORT_PARAMS = ['fullName']

export default (router) => {
  router.route('/client-files')
    .get([
      parsePagination(ACCEPTED_SORT_PARAMS),
      parseFilters(filtersSchema),
      makeFindAllHandler(ClientRepository)
    ])
    .post([validateClient, makeHandlePost(ClientRepository)])

  router.route('/client-files/archive')
    .post([
      makeHandleArchive(ClientRepository),
      deleteFeedSubscriptions
    ])

  router.route('/client-files/restore')
    .post(makeHandleRestore(ClientRepository))

  router.route('/client-files/emailDistributionList')
    .get(getEmailDistributionList)

  router.route('/client-files/:id')
    .get(makeFindById(ClientRepository))
    .put([validateClient, makeHandlePut(ClientRepository)])

  router.route('/client-files/:id/evolution-notes')
    .get(getDocumentsByClientId(EvolutionNoteRepository))

  router.route('/my-clients')
    .get(getUserSubscribedClients)

}
