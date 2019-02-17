import {FormTemplateRepository, FormShortcutRepository} from '../repository'
import {makeFindAllHandler, makeFindById, makeHandlePost, makeHandlePut, makeHandleDelete} from './StandardController'
import {entityFromBody} from '../middlewares/entityFromBody'
import {formShortcutSchema} from '../../modules/form-shortcut/schema'

function preInsert (req, res, next) {
  // ensure form template file exists
  const formTemplateRepo = new FormTemplateRepository(req.database)
  formTemplateRepo.findById(req.entity.formTemplateId)
    .then(form => {
      if (!form) {
        throw {httpStatus: 400, message: 'form template does not exist'}
      } else if (form.isArchived) {
        throw {httpStatus: 400, message: 'form template is archived'}
      } else {
        next()
      }
    })
    .catch(next)
}

export default (router) => {
  router.use('/form-shortcuts', entityFromBody(formShortcutSchema))
  router.route('/form-shortcuts')
    .get(makeFindAllHandler(FormShortcutRepository))
    .post([
      preInsert,
      makeHandlePost(FormShortcutRepository)
    ])
    .delete(makeHandleDelete(FormShortcutRepository))

  router.route('/form-shortcuts/:id')
    .get(makeFindById(FormShortcutRepository))
    .put(makeHandlePut(FormShortcutRepository))
}
