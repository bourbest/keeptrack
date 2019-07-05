import {NotificationRepository} from '../../repository'
import {ObjectId} from 'mongodb'
import {forEach} from 'lodash'
import ClientFeedSubscriptionRepository from '../../repository/ClientFeedSubscriptionRepository'

export function createClientNotifications (notificationTemplate) {
  return function (req, res, next) {
    const notfRepo = new NotificationRepository(req.database)
    const subscriptionRepo = new ClientFeedSubscriptionRepository(req.database)

    const filters = {clientId: req.entity.clientId}
    subscriptionRepo.findAll(filters)
      .then(subscriptions => {
        const notifications = []
        const now = new Date()

        // do not create a notification for user that created the event
        const currentUserId = ObjectId(req.user.id)
        forEach(subscriptions, subscription => {
          if (!subscription.userId.equals(currentUserId)) {
            const notification = {...notificationTemplate}
            notification.clientId = req.entity.clientId
            notification.formId = req.entity.formId
            notification.userId = subscription.userId
            notification.targetId = req.entity.id
            notification.isRead = false
            notification.isArchived = false
            notification.createdOn = now
            notification.modifiedOn = now
            notifications.push(notification)
          }
        })
        if (notifications.length) {
          notfRepo.insertMany(notifications)
            .then( () => {
              next()
            })
        } else {
          next()
        }
      })
  }
}