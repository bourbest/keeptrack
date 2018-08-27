import {convertFromDatabase, createBaseRepository} from './MongoRepository'
import {ObjectId} from 'mongodb'

const EvolutionNoteRepository = createBaseRepository('EvolutionNote')

EvolutionNoteRepository.prototype.findByClientId = function (id) {
  const filters = {clientId: ObjectId(id)}
  return this.collection.find(filters)
    .toArray()
    .then(convertFromDatabase)
}

EvolutionNoteRepository.prototype.findNewForUser = function (userId) {
  return this.collection.aggregate([{
    $lookup: {
      from: 'ClientFeedSubscription',
      let: { clientId: '$clientId', userId: '$userId' },
      pipeline: [{
        $match: {
          $expr: {
            $and: [
              { $eq: ['$clientId', '$$clientId'] },
              { $eq: ['$userId', userId] }
            ]
          }
        }
      }, {
        $project: { _id: 0 } }
      ],
      as: 'subscriptionData'
    }
  }, {
    $match: { 'subscriptionData.0': { $exists: true } }
  }]).toArray()
}

export default EvolutionNoteRepository
