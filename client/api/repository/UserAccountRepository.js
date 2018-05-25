import {addStartsWithCriteria, convertFromDatabase, createBaseRepository, prepareForDatabase} from './MongoRepository'
import {isArray, omit} from 'lodash'

const UserAccountRepository = createBaseRepository('UserAccount')

function addFullName (entity) {
  entity = prepareForDatabase(entity)
  entity.fullName = entity.firstName + ' ' + entity.lastName
  return entity
}

UserAccountRepository.prototype.prepareForDatabase = function (entity) {
  if (isArray(entity)) {
    return entity.map(addFullName)
  }
  return addFullName(entity)
}

function removeFullName (entity) {
  entity = convertFromDatabase(entity)
  return omit(entity, 'fullName')
}

UserAccountRepository.prototype.convertFromDatabase = function (entity) {
  if (isArray(entity)) {
    return entity.map(removeFullName)
  }
  return removeFullName(entity)
}

UserAccountRepository.prototype.convertFilters = (filters) => {
  const ret = omit(filters, 'contains')
  if (filters.contains && filters.contains.length > 0) {
    addStartsWithCriteria(ret, 'fullName', filters.contains)
  }
  return ret
}

UserAccountRepository.prototype.findByUsername = function (username) {
  const filters = {username}
  return this.collection.findOne(filters)
    .then(this.convertFromDatabase)
}

export default UserAccountRepository
