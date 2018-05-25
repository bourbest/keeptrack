import {ObjectId} from 'mongodb'
import {EvolutionNoteRepository, ClientRepository} from '../repository'
import {makeFindAllHandler, makeFindById, makeHandlePost} from './StandardController'
import {entityFromBody} from '../middlewares/entityFromBody'
import {evolutionNoteSchema} from '../../modules/evolution-notes/validate'

function preInsert (req, res, next) {
  // ensure client file exists
  const clientRepo = new ClientRepository(req.database)
  clientRepo.findById(req.entity.clientId)
    .then(client => {
      if (!client) {
        res.status(404).json({error: 'client does not exist'})
      } else {
        const {entity, user} = req
        entity.ownerId = ObjectId(user.id)
        entity.authorName = user.firstName + ' ' + user.lastName
        entity.authorRole = user.organismRole
        next()
      }
    })
    .catch(next)
}

export default (router) => {
  router.use('/evolution-notes', entityFromBody(evolutionNoteSchema))
  router.route('/evolution-notes')
    .get(makeFindAllHandler(EvolutionNoteRepository))
    .post([
      preInsert,
      makeHandlePost(EvolutionNoteRepository)
    ])
  router.route('/evolution-notes/:id')
    .get(makeFindById(EvolutionNoteRepository))
}
