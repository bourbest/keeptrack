import {map, max} from 'lodash'

const Selectors = {}
Selectors.getEntities = state => state.notifications.notifications
Selectors.isFetchingList = state => state.notification.isFetchingList

Selectors.getYoungestNotificationDate = state => {
  let ret = null
  const dates = map(Selectors.getEntities(state), 'createdOn')
  // this array is always sorted by createdOn desc
  if (dates.length > 0) {
    ret = max(dates)
  }
  return ret
}

export default Selectors
