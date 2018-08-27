import {FormTemplateRepository} from '../repository'
import {makeFindAllHandler, makeFindById, makeHandleArchive, makeHandlePost, makeHandlePut} from './StandardController'
import {entityFromBody, parseFilters, parsePagination} from '../middlewares'
import {formSchema} from '../../modules/form-templates/validate'
import {boolean, Schema, string} from 'sapin'

const ACCEPTED_SORT_PARAMS = ['fullName']

const filtersSchema = new Schema({
  contains: string,
  isArchived: boolean,
  includeArchived: boolean
})

export default (router) => {
  router.use('/form-templates', entityFromBody(formSchema))
  router.route('/form-templates')
    .get([
      parsePagination(ACCEPTED_SORT_PARAMS),
      parseFilters(filtersSchema),
      makeFindAllHandler(FormTemplateRepository)
    ])
    .post(makeHandlePost(FormTemplateRepository))
    .delete(makeHandleArchive(FormTemplateRepository))
  router.route('/form-templates/:id')
    .get(makeFindById(FormTemplateRepository))
    .put(makeHandlePut(FormTemplateRepository))
}
