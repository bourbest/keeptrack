import {size, set, forEach, find, filter, isArray} from 'lodash'
import {ClientRepository, ClientFeedSubcriptionRepository, FormTemplateRepository, UploadedFileRepository, ClientLinkRepository, NotificationRepository, BlockedFileRepository} from '../repository'
import {
  makeFindAllHandler, makeFindById, makeHandleArchive, makeHandlePost, makeHandlePut,
  makeHandleRestore, makeHandleDelete
} from './StandardController'
import {parsePagination, parseFilters, requiresRole} from '../middlewares'
import {getValidationsForField} from '../../modules/client-documents/client-document-utils'

import {string, boolean, Schema, validate, transform, date} from 'sapin'
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
      const errors = validate(req.body, clientSchema, null, false)

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

function ignoreError () {}

function deleteClient (database, clientId, appPath) {
  const uploadedFileRepo = new UploadedFileRepository(database)
  const documentRepo = new ClientDocumentRepository(database)
  const clientLinkRepo = new ClientLinkRepository(database)
  const notificationRepo = new NotificationRepository(database)
  const blockedFileRepo = new BlockedFileRepository(database)
  const clientFeedSubscriptionRepo = new ClientFeedSubcriptionRepository(database)
  const clientRepo = new ClientRepository(database)

  return uploadedFileRepo.findAll({clientId}).then(files => {
    const promises = [Promise.resolve()]
    forEach(files, file => {
      console.log(`delete file ${clientId} - ${file.uri}`)
      let fullPath = path.join(appPath, file.uri)
      promises.push(fs.promises.unlink(fullPath).catch(ignoreError))
    })

    return Promise.all(promises)
      .then(function () {
        console.log(`deleting clientId ${clientId}`)
        const deleteFilter = {clientId}
        promises.push(uploadedFileRepo.deleteByFilters(deleteFilter))
        promises.push(documentRepo.deleteByFilters(deleteFilter))
        promises.push(notificationRepo.deleteByFilters(deleteFilter))
        promises.push(clientLinkRepo.deleteByFilters({clientId1: clientId}))
        promises.push(clientLinkRepo.deleteByFilters({clientId2: clientId}))
        promises.push(blockedFileRepo.deleteByFilters(deleteFilter))
        promises.push(clientFeedSubscriptionRepo.deleteByFilters(deleteFilter))
        promises.push(clientRepo.delete([clientId]))
        return Promise.all(promises)
          .then(function (x) {
            console.log(`deleted clientId ${clientId}`)
            return x
          })
          .catch(function (ex) {
            console.log(`error deleting clientId ${clientId}: ${ex.toString()}`)
            return ex
          })
      })
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

function filterBlockedFiles (req, res, next) {
  res.result.entities = filter(res.result.entities, c => req.user.blockedFiles.indexOf(c.id.toString()) === -1)
  next()
}

function removeBlockedFilesFromIds (req, res, next) {
  if (!isArray(req.body) || req.body.length === 0) {
    return next({httpStatus: 400, message: 'no ids provided in the body'})
  } else {
    req.body = filter(req.body, id => req.user.blockedFiles.indexOf(id) === -1)
    next()
  }
}

function ensureClientIsNotBlocked (req, res, next) {
  if (req.user.blockedFiles.indexOf(req.params.id) >= 0) {
    return next({httpStatus: 403, message: 'access forbidden'})
  }
  next()
}

function purgeClientFiles (context) {
  return function (req, res, next) {
    const clientRepo = new ClientRepository(req.database)

    const currentDate = new Date()

    // Subtract 7 years from the current date
    const sevenYearsAgo = new Date(currentDate)
    sevenYearsAgo.setFullYear(currentDate.getFullYear() - 7)

    clientRepo.findUpdatedBefore(sevenYearsAgo)
      .then(function (list) {
        // res.result = list
        // next()
        const promises = list.map(file => {
          return deleteClient(req.database, file.id, context.appPath)
        })
        return Promise.all(promises)
          .then(() => {
            console.log('delete completed')
            res.result = list
            next()
          })
          .catch(next)
      })
      .catch(next)
    }
}

function getClientsToPurge (req, res, next) {
  const clientRepo = new ClientRepository(req.database)

  const currentDate = new Date()

  // Subtract 7 years from the current date
  const sevenYearsAgo = new Date(currentDate)
  sevenYearsAgo.setFullYear(currentDate.getFullYear() - 7)

  clientRepo.findUpdatedBefore(sevenYearsAgo)
    .then(function (list) {
      res.result = list
      next()
    })
    .catch(next)
}

export default (router, context) => {
  router.use('/client-files', requiresRole(ROLES.canCreateClientFiles))
  router.route('/client-files')
    .get([
      parsePagination(ACCEPTED_SORT_PARAMS),
      parseFilters(filtersSchema),
      makeFindAllHandler(ClientRepository),
      filterBlockedFiles,
      addClientTypeToResults
    ])
    .post([validateClient, updateAcceptEmailModifiedOn, makeHandlePost(ClientRepository)])

  router.route('/client-files/archive')
    .post([
      removeBlockedFilesFromIds,
      makeHandleArchive(ClientRepository),
      deleteFeedSubscriptions
    ])

  router.route('/client-files/restore')
    .post([
      removeBlockedFilesFromIds,
      makeHandleRestore(ClientRepository)])

  router.route('/client-files')
    .delete([
      removeBlockedFilesFromIds,
      deleteClientFileComponents(context.appPath),
      makeHandleDelete(ClientRepository)
    ])

  router.route('/purge-client-files')
    .post(purgeClientFiles(context))
    .get(getClientsToPurge)

  router.route('/client-files/:id')
    .get([ensureClientIsNotBlocked, makeFindById(ClientRepository)])
    .put([ensureClientIsNotBlocked, validateClient, updateAcceptEmailModifiedOn, makeHandlePut(ClientRepository)])

  router.route('/my-clients')
    .get([getUserSubscribedClients,
      filterBlockedFiles,
      addClientTypeToResults])

}
