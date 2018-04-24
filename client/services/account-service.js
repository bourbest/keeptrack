import RestService from './base/rest-service'
const url = 'accounts'

export default class AccountService extends RestService {
  constructor (apiClient) {
    super(url, apiClient)
  }
}

