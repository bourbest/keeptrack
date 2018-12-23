import {omit} from 'lodash'
import {createBaseRepository} from './MongoRepository'
import {ObjectId} from 'mongodb'

const NotificationRepository = createBaseRepository('Notification')

NotificationRepository.prototype.convertFilters = (filters) => {
  const ret = omit(filters, ['fromDate', 'fromId'])
  
  if (filters.fromDate && filters.fromId) {
    ret.createdOn = {
      $gte: new ISODate(filters.fromDate)
    }
    ret.userId = {
      $gte: ObjectId(filters.fromId)
    }
  }
  return ret
}

export default NotificationRepository
