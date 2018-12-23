import RestService from './base/rest-service'
const url = 'notifications'

export default class NotificationService extends RestService {
  constructor (apiClient) {
    super(url, apiClient)
    this.markAsRead = this.markAsRead.bind(this)
  }

  markAsRead (notificationId, isRead) {
    return this.apiClient.patch(url, {isRead}, notificationId)
  }
}
