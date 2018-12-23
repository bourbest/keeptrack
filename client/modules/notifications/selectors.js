import {tail} from 'lodash'

const Selectors = {}
Selectors.getEntities = state => state.notifications.notifications
Selectors.isFetchingList = state => state.notification.isFetchingList

Selectors.getYoungestNotificationDate = state => {
  let ret = null
  const notifications = Selectors.getEntities(state)
  // this array is always sorted by createdOn desc
  if (notifications.length > 0) {
    ret = tail(notifications).createdOn
  }
  return ret
}

Selectors.getYoungestNotificationId = state => {
  let ret = null
  const notifications = Selectors.getEntities(state)
  // this array is always sorted by createdOn desc
  if (notifications.length > 0) {
    ret = tail(notifications).id
  }
  return ret
}

export default Selectors
