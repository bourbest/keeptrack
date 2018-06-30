import {ClientDocumentRespository, ClientRepository, FormTemplateRepository} from '../repository'
import {makeFindAllHandler, makeFindById, makeHandleDelete, makeHandlePost, makeHandlePut} from './StandardController'
import {entityFromBody, parsePagination, parseFilters} from '../middlewares'
import {clientDocumentSchema} from '../../modules/client-documents/schema'
import {buildSchemaForFields} from '../../modules/form-templates/dynamic-form-validation'

import {boolean, Schema, validate} from 'sapin'
import {objectId} from '../../modules/common/validate'

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
    clients.findById(req.entity.clientId),
    forms.findById(req.entity.formId)
  ]
  Promise.all(promises)
    .then(data => {
      const client = data[0]
      const form = data[1]
      if (!client) {
        return next({httpStatus: 400, message: 'Client does not exist'})
      } else if (!form) {
        return next({httpStatus: 400, message: 'Form does not exist'})
      }
      const schema = buildSchemaForFields(form.fields)
      const errors = validate(req.entity, schema)
      if (errors) {
        return next({httpStatus: 400, message: 'Document does does not respect Form Schema', errors})
      }
      next()
    })
    .catch(next)
}

export default (router) => {
  router.use('/client-documents', entityFromBody(clientDocumentSchema))
  router.route('/client-documents')
    .get([
      parsePagination(ACCEPTED_SORT_PARAMS),
      parseFilters(filtersSchema),
      makeFindAllHandler(ClientDocumentRespository)
    ])
    .post([
      validateDocument,
      makeHandlePost(ClientDocumentRespository)
    ])
    .delete(makeHandleDelete(ClientDocumentRespository))

  router.route('/client-documents/:id')
    .get(makeFindById(ClientDocumentRespository))
    .put([
      validateDocument,
      makeHandlePut(ClientDocumentRespository)
    ])
}
