import {ClientRepository, ClientDocumentRespository, EvolutionNoteRepository} from '../repository'
import {makeFindAllHandler, makeFindById, makeHandlePost, makeHandlePut} from './StandardController'
import {entityFromBody, parsePagination, parseFilters} from '../middlewares'
import {clientSchema} from '../../modules/clients/schema'
import {string, boolean, Schema} from 'sapin'

const filtersSchema = new Schema({
  contains: string,
  isArchived: boolean
})

function getDocumentsByClientId (Repository) {
  return function (req, res, next) {
    const repo = new Repository(req.database)
    return repo.findByClientId(req.params.id)
      .then(function (entity) {
        res.json(entity)
      })
      .catch(next)
  }
}

const ACCEPTED_SORT_PARAMS = ['firstName', 'lastName', 'email']

export default (router) => {
  router.use('/client-files', entityFromBody(clientSchema))
  router.route('/client-files')
    .get([
      parsePagination(ACCEPTED_SORT_PARAMS),
      parseFilters(filtersSchema),
      makeFindAllHandler(ClientRepository)
    ])
    .post(makeHandlePost(ClientRepository))

  router.route('/client-files/:id')
    .get(makeFindById(ClientRepository))
    .put(makeHandlePut(ClientRepository))
  router.route('/client-files/:id/documents')
    .get(getDocumentsByClientId(ClientDocumentRespository))
  router.route('/client-files/:id/evolution-notes')
    .get(getDocumentsByClientId(EvolutionNoteRepository))
}
