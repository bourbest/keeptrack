import {ObjectId} from 'mongodb'
import {EvolutionNoteRepository, ClientRepository} from '../repository'
import {makeFindAllHandler, makeFindById, makeHandlePost} from './StandardController'
import {entityFromBody} from '../middlewares/entityFromBody'
import {evolutionNoteSchema} from '../../modules/evolution-notes/schema'
import {boolean, Schema} from 'sapin'
import {parseFilters, parsePagination} from '../middlewares'

import {createClientNotifications} from './notifications/create-notifications'
import {NotificationTypes} from '../../modules/notifications/schema'

const ACCEPTED_SORT_PARAMS = ['fullName']

const filtersSchema = new Schema({
  isArchived: boolean
})

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
    .get([
      parsePagination(ACCEPTED_SORT_PARAMS),
      parseFilters(filtersSchema),
      makeFindAllHandler(EvolutionNoteRepository)
    ])
    .post([
      preInsert,
      makeHandlePost(EvolutionNoteRepository),
      createClientNotifications({type: NotificationTypes.EvolutiveNoteCreated })
    ])
  router.route('/evolution-notes/:id')
    .get(makeFindById(EvolutionNoteRepository))
}
