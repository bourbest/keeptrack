import {omit, isArray} from 'lodash'
import {
  createBaseRepository,
  prepareForDatabase,
  convertFromDatabase,
  addStartsWithCriteria
} from './MongoRepository'

const ClientRepository = createBaseRepository('ClientFile')

function addFullName (entity) {
  entity = prepareForDatabase(entity)
  entity.fullName = entity.firstName + ' ' + entity.lastName
  return entity
}

ClientRepository.prototype.prepareForDatabase = function (entity) {
  if (isArray(entity)) {
    return entity.map(addFullName)
  }
  return addFullName(entity)
}

function removeFullName (entity) {
  entity = convertFromDatabase(entity)
  return omit(entity, 'fullName')
}

ClientRepository.prototype.convertFromDatabase = function (entity) {
  if (isArray(entity)) {
    return entity.map(removeFullName)
  }
  return removeFullName(entity)
}

ClientRepository.prototype.convertFilters = function (filters) {
  const ret = omit(filters, 'contains')
  if (filters.contains && filters.contains.length > 0) {
    addStartsWithCriteria(ret, 'fullName', filters.contains)
  }
  return ret
}

export default ClientRepository
