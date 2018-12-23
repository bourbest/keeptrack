import {values} from 'lodash'
import {compareStrings} from '../../services/string-utils'

const Selectors = {}
Selectors.getMyClients = state => state.dashboard.clientsById
Selectors.isFetchingMyClients = state => state.dashboard.isFetchingMyClients

const sortClientsByName = (lhs, rhs) => {
  let ret = compareStrings(lhs.firstName, rhs.firstName)
  if (ret === 0) {
    ret = compareStrings(lhs.lastName, rhs.lastName)
  }
  return ret
}

Selectors.getOrderedClients = state => {
  const clients = values(Selectors.getMyClients(state))
  clients.sort(sortClientsByName)
  return clients
}

export default Selectors
