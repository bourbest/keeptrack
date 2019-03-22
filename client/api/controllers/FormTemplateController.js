import {FormTemplateRepository} from '../repository'
import {makeFindAllHandler, makeFindById, makeHandleArchive, makeHandlePost, makeHandlePut, makeHandleRestore} from './StandardController'
import {entityFromBody, parseFilters, parsePagination, requiresRole} from '../middlewares'
import {formSchema} from '../../modules/form-templates/validate'
import {boolean, Schema, string} from 'sapin'
import ROLES from '../../modules/accounts/roles'

const ACCEPTED_SORT_PARAMS = ['fullName']

const filtersSchema = new Schema({
  contains: string,
  isArchived: boolean,
  includeArchived: boolean
})

export default (router) => {
  const validateSchema = entityFromBody(formSchema)
  router.use('/form-templates', requiresRole(ROLES.formsManager))
  router.route('/form-templates')
    .get([
      parsePagination(ACCEPTED_SORT_PARAMS),
      parseFilters(filtersSchema),
      makeFindAllHandler(FormTemplateRepository)
    ])
    .post([validateSchema, makeHandlePost(FormTemplateRepository)])
  router.route('/form-templates/archive')  
    .post(makeHandleArchive(FormTemplateRepository))
  router.route('/form-templates/restore')  
    .post(makeHandleRestore(FormTemplateRepository))    
  router.route('/form-templates/:id')
    .get(makeFindById(FormTemplateRepository))
    .put([validateSchema, makeHandlePut(FormTemplateRepository)])
}
