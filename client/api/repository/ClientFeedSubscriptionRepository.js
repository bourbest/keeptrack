import {createBaseRepository, update} from './MongoRepository'

const ClientFeedSubscriptionRepository = createBaseRepository('ClientFeedSubscription')

ClientFeedSubscriptionRepository.prototype.deleteByClientIds = clientIds => {
  const filters = {clientId: {$in: clientIds}}

  return this.collection.deleteMany(filters, update)
}
export default ClientFeedSubscriptionRepository
