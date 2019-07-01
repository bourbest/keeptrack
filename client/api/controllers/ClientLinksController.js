import {some} from 'lodash'
import {ClientLinkRepository, ClientRepository} from '../repository'
import {makeHandleDelete, makeHandlePost} from './StandardController'
import {entityFromBody} from '../middlewares'
import {clientLinkSchema} from '../../modules/client-links/schema'
//import {createClientNotifications} from './notifications/create-notifications'

import {ObjectId} from 'mongodb'
import {objectId} from '../../modules/common/validate'
//import {NotificationTypes} from '../../modules/notifications/schema'

const validateClientExists = (req, res, next) => {
  const newLink = req.entity
  if (newLink.clientId1 === newLink.clientId2) {
    next({httpStatus:400, message: 'Cannot link client file to self'})
    return
  }

  const clientRepo = new ClientRepository(req.database)
  clientRepo.findByIds([newLink.clientId1, newLink.clientId2])
    .then(clients => {
      if (clients.length !== 2) {
        next({httpStatus: 400, message: 'At least one end of the link does not exist'})
        return
      }
      next()
    })
}

const ensureLinkIsUnique = (req, res, next) => {
  const newLink = req.entity
  const otherClientId = newLink.clientId1 === req.params.clientId ? newLink.clientId2 : newLink.clientId1
  const linkRepo = new ClientLinkRepository(req.database)
  linkRepo.getLinksForClientId(req.params.clientId)
    .then(links => {
      if (some(links, link => link.clientId1 === otherClientId || link.clientId2 === otherClientId)) {
        next({httpStatus: 400, message: 'This link already exists'})
        return
      }
      next()
    })
}

const findLinksForClientId = (req, res, next) => {
  const repo = new ClientLinkRepository(req.database) 
  repo.getLinksForClientId(req.params.clientId)
    .then(function (links) {
      res.json(links)
    })
    .catch(next)
}

export default (router) => {
  router.route('/client-files/:clientId/client-links')
    .get(findLinksForClientId)
    .post([
      entityFromBody(clientLinkSchema),
      ensureLinkIsUnique,
      validateClientExists,
      makeHandlePost(ClientLinkRepository)
    ])
    .delete([
      makeHandleDelete(ClientLinkRepository)
    ])
}
