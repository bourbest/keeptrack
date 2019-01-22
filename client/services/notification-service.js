import RestService from './base/rest-service'
const url = 'notifications'

export default class NotificationService extends RestService {
  constructor (apiClient) {
    super(url, apiClient)
  }
}
