import RestService from './base/rest-service'
const url = 'accounts'

export default class AccountService extends RestService {
  constructor (apiClient) {
    super(url, apiClient)
    this.changePassword = this.changePassword.bind(this)
  }

  changePassword (payload) {
    return this.apiClient.post('my-account/change-password', payload)
  }
}

