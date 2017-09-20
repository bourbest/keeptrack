import RestService from './base/rest-service'
import {isArray, pickBy, identity, keys} from 'lodash'
const url = 'accounts'

export const clientFromApi = (fromApi) => {
  const res = {...fromApi}
  const roles = {}

  if (isArray(fromApi.roles)) {
    for (let i = 0; i < fromApi.roles.length; i++) {
      roles[fromApi.roles[i]] = true
    }
  }

  res.roles = roles
  return res
}

export const clientToApi = (toApi) => {
  const res = {...toApi}
  res.roles = keys(pickBy(toApi.roles, identity))
  return res
}

export default class AccountService extends RestService {
  constructor (apiClient) {
    super(url, apiClient, clientFromApi, clientToApi)
  }
}

