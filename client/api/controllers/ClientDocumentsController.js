import {size} from 'lodash'
import {ObjectId} from 'mongodb'
import {ClientDocumentRespository, ClientRepository, FormTemplateRepository} from '../repository'
import {makeFindAllHandler, makeFindById, makeHandleArchive, makeHandlePost, makeHandlePut, setAuthor} from './StandardController'
import {entityFromBody, parsePagination, parseFilters} from '../middlewares'
import {BaseClientDocumentSchema} from '../../modules/client-documents/schema'
import {buildSchemaForDocument} from '../../modules/client-documents/client-document-validation'
import {createClientNotifications} from './notifications/create-notifications'

import {boolean, Schema, validate, transform} from 'sapin'
import {objectId} from '../../modules/common/validate'
import {NotificationTypes} from '../../modules/notifications/schema'
import { ClientLinkOptions } from '../../modules/form-templates/config'

const filtersSchema = new Schema({
  clientId: objectId,
  intervenantId: objectId,
  isArchived: boolean
})

const ACCEPTED_SORT_PARAMS = ['createdOn']


function validateDocument (req, res, next) {
  const clients = new ClientRepository(req.database)
  const forms = new FormTemplateRepository(req.database)
  
  const promises = [
    forms.findById(req.entity.formId)
  ]

  if (req.entity.clientId) {
    promises.push(clients.findById(req.entity.clientId))
  }

  Promise.all(promises)
    .then(data => {
      const client = data[1] 
      const form = data[0]

      if (!form) {
        return next({httpStatus: 400, message: 'Form does not exist'})
      }

      const schema = buildSchemaForDocument(form)
      const errors = validate(req.body, schema)
      if (size(errors)) {
        return next({httpStatus: 400, message: 'Document does not respect Form Schema', errors})
      } else if (form.clientLink === ClientLinkOptions.MANDATORY && !client) {
        return next({httpStatus: 400, message: 'Client does not exist'})
      }

      req.entity = transform(req.body, schema)
      next()
    })
    .catch(next)
}

export default (router) => {
  router.use('/client-documents', entityFromBody(BaseClientDocumentSchema))
  router.route('/client-documents')
    .get([
      parsePagination(ACCEPTED_SORT_PARAMS),
      parseFilters(filtersSchema),
      makeFindAllHandler(ClientDocumentRespository)
    ])
    .post([
      validateDocument,
      setAuthor,
      makeHandlePost(ClientDocumentRespository),
      createClientNotifications({type: NotificationTypes.ClientDocumentCreated })
    ])
    .delete([
      makeHandleArchive(ClientDocumentRespository),
      createClientNotifications({type: NotificationTypes.ClientDocumentArchived })
    ])

  router.route('/client-documents/:id')
    .get(makeFindById(ClientDocumentRespository))
    .put([
      validateDocument,
      makeHandlePut(ClientDocumentRespository),
      createClientNotifications({type: NotificationTypes.ClientDocumentModified })
    ])
}
