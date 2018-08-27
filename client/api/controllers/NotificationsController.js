import {ObjectId} from 'mongodb'
import {EvolutionNoteRepository} from '../repository'

function findNewNotesForUser (req, res, next) {
  if (req.user) {
    const userId = ObjectId(req.user.id)
    const repo = new EvolutionNoteRepository(req.database)
    repo.findNewForUser(userId)
      .then(data => {
        res.json(data)
      })
      .catch(next)
  } else {
    res.status(400)
    res.json({error: 'Not authenticated'})
  }
}
export default (router) => {
  router.route('/notifications')
    .get(findNewNotesForUser)
}
