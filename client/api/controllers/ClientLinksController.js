import {some, forEach, find} from 'lodash'
import {ClientLinkRepository, ClientRepository, FormTemplateRepository} from '../repository'
import {makeHandleDelete, makeHandlePost} from './StandardController'
import {entityFromBody} from '../middlewares'
import {clientLinkSchema} from '../../modules/client-links/schema'
import { getChoices } from '../../modules/clients/client-form-selectors'
import { CLIENT_FORM_ID } from '../../modules/const'
import {createClientNotifications} from './notifications/create-notifications'

import {NotificationTypes} from '../../modules/notifications/schema'

const validateClientExists = (req, res, next) => {
  const newLink = req.entity
  if (newLink.clientId1 === newLink.clientId2) {
    return next({httpStatus:400, message: 'Cannot link client file to self'})
  }

  const clientRepo = new ClientRepository(req.database)
  clientRepo.findByIds([newLink.clientId1, newLink.clientId2])
    .then(clients => {
      if (clients.length !== 2) {
        return next({httpStatus: 400, message: 'At least one end of the link does not exist'})
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
        return next({httpStatus: 400, message: 'This link already exists'})
      }
      next()
    })
}

const findLinksForClientId = (req, res, next) => {
  const clientRepo = new ClientLinkRepository(req.database)
  const formRepo = new FormTemplateRepository(req.database)
  const promises = []

  promises.push(clientRepo.getLinksForClientId(req.params.clientId))
  promises.push(formRepo.findById(CLIENT_FORM_ID))

  Promise.all(promises)
    .then(results => {
      const links = results[0]
      const formTemplate = results[1]
      if (!formTemplate) {
        return next({httpStatus: 500, message: 'System Client Form Template not found'})
      }
      const clientTypeIdNode = find(formTemplate.fields, {id: 'clientTypeId'})
      const clientTypesById = getChoices(clientTypeIdNode, 'fr')
      forEach(links, link => {
        link.client.clientType = clientTypesById[link.client.clientTypeId]
      })
      res.result = links
      next()
    })
    .catch(next)
}

function getClientId1(req) {
  return req.entity.clientId1
}
function getClientId2(req) {
  return req.entity.clientId2
}

export default (router) => {
  router.route('/client-files/:clientId/client-links')
    .get(findLinksForClientId)
    .post([
      entityFromBody(clientLinkSchema),
      ensureLinkIsUnique,
      validateClientExists,
      makeHandlePost(ClientLinkRepository),
      createClientNotifications({type: NotificationTypes.ClientLinkCreated}, getClientId1),
      createClientNotifications({type: NotificationTypes.ClientLinkCreated}, getClientId2)
    ])
    .delete([
      makeHandleDelete(ClientLinkRepository)
    ])
}
