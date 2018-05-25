import {FormTemplateRepository} from '../repository'
import {makeFindAllHandler, makeFindById, makeHandlePost, makeHandlePut} from './StandardController'
// import {entityFromBody} from '../middlewares/entityFromBody'
// import {formTemplateSchema} from '../../modules/form-templates/validate'

export default (router) => {
  // router.use('/form-templates', entityFromBody(formTemplateSchema))
  router.route('/form-templates')
    .get(makeFindAllHandler(FormTemplateRepository))
    .post(makeHandlePost(FormTemplateRepository))
  router.route('/form-templates/:id')
    .get(makeFindById(FormTemplateRepository))
    .put(makeHandlePut(FormTemplateRepository))
}
