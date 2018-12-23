import {ObjectId} from 'mongodb'
import {createBaseRepository, convertFromDatabase} from './MongoRepository'
import {forEach} from 'lodash'

const ClientFeedSubscriptionRepository = createBaseRepository('ClientFeedSubscription')

ClientFeedSubscriptionRepository.prototype.deleteByClientIds = function (clientIds) {
  const filters = {clientId: {$in: clientIds}}
  return this.collection.deleteMany(filters)
}

const getClientsFromAggregateResponse = results => {
  const res = []
  forEach(results, result => res.push(result.clients[0]))
  return convertFromDatabase(res)
}

ClientFeedSubscriptionRepository.prototype.getClientsSubscribedForUserId = function (userId) {
  const match = {
    $match : { userId : ObjectId(userId) }
  }
  const lookup = {
    $lookup: {
      from: 'ClientFile',
      localField: 'clientId',
      foreignField: '_id',
      as: 'clients'
  }}
  return this.collection
    .aggregate([match, lookup])
    .toArray()
    .then(getClientsFromAggregateResponse)
}

export default ClientFeedSubscriptionRepository
