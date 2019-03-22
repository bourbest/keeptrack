import {size, set, forEach} from 'lodash'
import {ClientRepository, ClientFeedSubcriptionRepository, FormTemplateRepository} from '../repository'
import {
  makeFindAllHandler, makeFindById, makeHandleArchive, makeHandlePost, makeHandlePut,
  makeHandleRestore
} from './StandardController'
import {parsePagination, parseFilters, requiresRole} from '../middlewares'
import {getValidationsForField} from '../../modules/client-documents/client-document-utils'

import {string, boolean, Schema, validate, transform, date} from 'sapin'
import {isArray} from 'lodash'
import {ObjectId} from 'mongodb'
import { CLIENT_FORM_ID } from '../../modules/const'
import { objectId } from '../../modules/common/validate'
import ROLES from '../../modules/accounts/roles'

const filtersSchema = new Schema({
  contains: string,
  isArchived: boolean
})

function deleteFeedSubscriptions (req, res, next) {
  if (!isArray(req.body) || req.body.length === 0) {
    throw {httpStatus: 400, message: 'no ids provided in the body'}
  }
  const repo = new ClientFeedSubcriptionRepository(req.database)
  const ids = req.body.map(ObjectId)
  return repo.deleteByClientIds(ids)
    .then(function () {
      next()
    })
    .catch(next)
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
        throw {httpStatus: 500, message: 'System Client Form Template not found'}
      }
      const baseSchema = {
        id: objectId,
        isArchived: boolean,
        createdOn: date,
        modifiedOn: date
      }

      forEach(formTemplate.fields, field => {
        const validations = getValidationsForField(field)
        set(baseSchema, field.id, validations)
      })
    
      const clientSchema = new Schema(baseSchema)
      const errors = validate(req.body, clientSchema, null, true)

      if (size(errors)) {
        throw {httpStatus: 400, message: 'Provided Client does not respect Schema', errors}
      }
      req.entity = transform(req.body, clientSchema)
      next()
    })
    .catch(next)
}

const ACCEPTED_SORT_PARAMS = ['fullName']

export default (router) => {
  router.use('/client-files', requiresRole(ROLES.canInteractWithClient))
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
    .get([
      requiresRole(ROLES.statsProducer, false),
      getEmailDistributionList
    ])

  router.route('/client-files/:id')
    .get(makeFindById(ClientRepository))
    .put([validateClient, makeHandlePut(ClientRepository)])

    router.route('/my-clients')
    .get(getUserSubscribedClients)

}
