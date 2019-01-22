import {omit} from 'lodash'
import {createBaseRepository} from './MongoRepository'

const NotificationRepository = createBaseRepository('Notification')

NotificationRepository.prototype.convertFilters = function (filters) {
  const ret = omit(filters, ['fromDate'])
  
  if (filters.fromDate) {
    ret.createdOn = {
      $gt: filters.fromDate
    }
  }
  return ret
}

export default NotificationRepository
