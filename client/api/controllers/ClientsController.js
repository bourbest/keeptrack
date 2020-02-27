import {size, set, forEach, find} from 'lodash'
import {ClientRepository, ClientFeedSubcriptionRepository, FormTemplateRepository, UploadedFileRepository, ClientLinkRepository, NotificationRepository} from '../repository'
import {
  makeFindAllHandler, makeFindById, makeHandleArchive, makeHandlePost, makeHandlePut,
  makeHandleRestore, makeHandleDelete
} from './StandardController'
import {parsePagination, parseFilters, requiresRole} from '../middlewares'
import {getValidationsForField} from '../../modules/client-documents/client-document-utils'

import {string, boolean, Schema, validate, transform, date} from 'sapin'
import {isArray} from 'lodash'
import {ObjectId} from 'mongodb'
import { CLIENT_FORM_ID } from '../../modules/const'
import { objectId } from '../../modules/common/validate'
import ROLES from '../../modules/accounts/roles'
import { getChoices } from '../../modules/clients/client-form-selectors'
import ClientDocumentRepository from '../repository/ClientDocumentRepository'
import fs from 'fs'
import path from 'path'

const filtersSchema = new Schema({
  contains: string,
  isArchived: boolean
})

function deleteFeedSubscriptions (req, res, next) {
  if (!isArray(req.body) || req.body.length === 0) {
    return next({httpStatus: 400, message: 'no ids provided in the body'})
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
      res.result = clients
      next()
    })
    .catch(next)
}

function addClientTypeToResults (req, res, next) {
  const formsRepo = new FormTemplateRepository(req.database)
  formsRepo.findById(CLIENT_FORM_ID)
    .then(formTemplate => {
      if (!formTemplate) {
        return next({httpStatus: 500, message: 'System Client Form Template not found'})
      }
      const clientTypeIdNode = find(formTemplate.fields, {id: 'clientTypeId'})
      const clientTypesById = getChoices(clientTypeIdNode, 'fr')
      const entities = res.result.entities || res.result 
      forEach(entities, client => {
        client.clientType = clientTypesById[client.clientTypeId]
      })
      next()
    })
}

function validateClient (req, res, next) {
  const formsRepo = new FormTemplateRepository(req.database)
  formsRepo.findById(CLIENT_FORM_ID)
    .then(formTemplate => {
      if (!formTemplate) {
        return next({httpStatus: 500, message: 'System Client Form Template not found'})
      }
      const baseSchema = {
        id: objectId,
        isArchived: boolean,
        createdOn: date,
        modifiedOn: date,
        acceptPublipostageModifiedOn: date
      }

      forEach(formTemplate.fields, field => {
        const validations = getValidationsForField(field)
        set(baseSchema, field.id, validations)
      })
    
      const clientSchema = new Schema(baseSchema)
      const errors = validate(req.body, clientSchema, null, true)

      if (size(errors)) {
        return next({httpStatus: 400, message: 'Provided Client does not respect Schema', errors})
      }
      req.entity = transform(req.body, clientSchema)
      next()
    })
    .catch(next)
}

function updateAcceptEmailModifiedOn (req, res, next) {
  if (req.entity.id === undefined) {
    if (req.entity.acceptPublipostage) {
      req.entity.acceptPublipostageModifiedOn = new Date()
    }
    next()
  } else {
    const clientRepo = new ClientRepository(req.database)
    clientRepo.findById(req.entity.id)
      .then(oldClient => {
        if (oldClient.acceptPublipostage !== req.entity.acceptPublipostage) {
          req.entity.acceptPublipostageModifiedOn = new Date()
        }
        next()
      })
      .catch(next)
  }
}

function deleteClient (database, clientId, appPath) {
  const uploadedFileRepo = new UploadedFileRepository(database)
  const documentRepo = new ClientDocumentRepository(database)
  const clientLinkRepo = new ClientLinkRepository(database)
  const notificationRepo = new NotificationRepository(database)

  return uploadedFileRepo.findAll({clientId}).then(files => {
    const promises = []
    forEach(files, file => {
      let fullPath = path.join(appPath, file.uri) 
      promises.push(fs.promises.unlink(fullPath))
    })

    const deleteFilter = {clientId}
    promises.push(uploadedFileRepo.deleteByFilters(deleteFilter))
    promises.push(documentRepo.deleteByFilters(deleteFilter))
    promises.push(notificationRepo.deleteByFilters(deleteFilter))
    promises.push(clientLinkRepo.deleteByFilters({clientId1: clientId}))
    promises.push(clientLinkRepo.deleteByFilters({clientId2: clientId}))

    return Promise.all(promises)
  })
}

function deleteClientFileComponents (appPath) {
  return function (req, res, next) {
    if (!isArray(req.body) || req.body.length === 0) {
      return next({httpStatus: 400, message: 'no ids provided in the body'})
    } else {
      const ids = req.body.map(ObjectId)
      const promises = []
      forEach(ids, clientId => {
        promises.push(deleteClient(req.database, clientId, appPath))
      })
      return Promise.all(promises)
        .then(function () {
          next()
        })
        .catch(next)
    }
  }
}
const ACCEPTED_SORT_PARAMS = ['fullName']

export default (router, context) => {
  router.use('/client-files', requiresRole(ROLES.canCreateClientFiles))
  router.route('/client-files')
    .get([
      parsePagination(ACCEPTED_SORT_PARAMS),
      parseFilters(filtersSchema),
      makeFindAllHandler(ClientRepository),
      addClientTypeToResults
    ])
    .post([validateClient, updateAcceptEmailModifiedOn, makeHandlePost(ClientRepository)])

  router.route('/client-files/archive')
    .post([
      makeHandleArchive(ClientRepository),
      deleteFeedSubscriptions
    ])

  router.route('/client-files/restore')
    .post(makeHandleRestore(ClientRepository))

  router.route('/client-files')
    .delete([
      deleteClientFileComponents(context.appPath),
      makeHandleDelete(ClientRepository)
    ])

  router.route('/client-files/:id')
    .get(makeFindById(ClientRepository))
    .put([validateClient, updateAcceptEmailModifiedOn, makeHandlePut(ClientRepository)])

    router.route('/my-clients')
    .get([getUserSubscribedClients, addClientTypeToResults])

}
