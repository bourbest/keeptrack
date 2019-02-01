import {NotificationRepository} from '../repository'
import {makeFindAllHandler, makeHandleDelete} from './StandardController'
import {boolean, Schema, date} from 'sapin'
import {parseFilters} from '../middlewares'

const filtersSchema = new Schema({
  isRead: boolean,
  fromDate: date
})

export default (router) => {
  router.route('/notifications')
    .get([
      parseFilters(filtersSchema, true),
      makeFindAllHandler(NotificationRepository)
    ])
    .delete(makeHandleDelete(NotificationRepository))
}
