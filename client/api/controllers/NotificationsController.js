import {NotificationRepository} from '../repository'
import {makeFindAllHandler} from './StandardController'
import {boolean, date, Schema} from 'sapin'
import {objectId} from '../../modules/common/validate'
import {parseFilters} from '../middlewares'

const filtersSchema = new Schema({
  fromDate: date,
  fromId: objectId,
  isRead: boolean,
  clientId: objectId
})

export default (router) => {
  router.route('/notifications')
    .get([
      parseFilters(filtersSchema, true),
      makeFindAllHandler(NotificationRepository)
    ])
}
