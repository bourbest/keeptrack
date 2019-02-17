import {ClientFeedSubcriptionRepository} from '../repository'
import {makeFindAllHandler, makeFindById, makeHandleDelete, makeHandlePost, makeHandlePut} from './StandardController'
import {entityFromBody, parseFilters, parsePagination} from '../middlewares'
import {Schema} from 'sapin'
import {objectId} from '../../modules/common/validate'
import {clientFeedSubscriptionSchema} from '../../modules/client-feed-subscriptions/schema'

const ACCEPTED_SORT_PARAMS = ['createdOn']

const filtersSchema = new Schema({
  clientId: objectId,
  userId: objectId
})

export default (router) => {
  router.use('/client-feed-subscriptions', entityFromBody(clientFeedSubscriptionSchema))
  router.route('/client-feed-subscriptions')
    .get([
      parsePagination(ACCEPTED_SORT_PARAMS),
      parseFilters(filtersSchema, true),
      makeFindAllHandler(ClientFeedSubcriptionRepository)
    ])
    .post([
      entityFromBody(clientFeedSubscriptionSchema),
      makeHandlePost(ClientFeedSubcriptionRepository)
    ])
    .delete(makeHandleDelete(ClientFeedSubcriptionRepository))
  router.route('/client-feed-subscriptions/:id')
    .get(makeFindById(ClientFeedSubcriptionRepository))
    .put([
      entityFromBody(clientFeedSubscriptionSchema),
      makeHandlePut(ClientFeedSubcriptionRepository)
    ])
}
