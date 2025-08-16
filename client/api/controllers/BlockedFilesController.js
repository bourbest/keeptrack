import {some, map} from 'lodash'
import {BlockedFileRepository, ClientRepository} from '../repository'
import {makeHandleDelete, makeHandlePost} from './StandardController'
import {entityFromBody} from '../middlewares'
import {blockedFileSchema} from '../../modules/blocked-files/schema'

const validateClientExists = (req, res, next) => {
  const newLink = req.entity

  const clientRepo = new ClientRepository(req.database)
  clientRepo.findById(newLink.clientId)
    .then(client => {
      if (client === null) {
        return next({httpStatus: 400, message: 'client does not exist'})
      }
      next()
    })
}

const ensureBlockedFileIsUniqueForUser = (req, res, next) => {
  const newLink = req.entity
  const clientId = newLink.clientId
  const blockedFilesRepo = new BlockedFileRepository(req.database)
  blockedFilesRepo.findByUserId(req.params.userId)
    .then(blockedFiles => {
      if (some(blockedFiles, file => file.clientId === clientId)) {
        return next({httpStatus: 400, message: 'This client file is already blocked'})
      }
      next()
    })
}

const findBlockedFilesForUserId = (req, res, next) => {
  const blockedFileRepo = new BlockedFileRepository(req.database)
  blockedFileRepo.findByUserId(req.params.userId)
    .then(blockedFiles => {
      res.result = blockedFiles
      next()
    })
    .catch(next)
}

export default (router) => {
  router.route('/accounts/:userId/blocked-files')
    .get(findBlockedFilesForUserId)
    .post([
      entityFromBody(blockedFileSchema),
      ensureBlockedFileIsUniqueForUser,
      validateClientExists,
      makeHandlePost(BlockedFileRepository)
    ])
    .delete([
      makeHandleDelete(BlockedFileRepository)
    ])
}
