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

ClientRepository.prototype.findUpdatedBefore = function (beforeDate) {
  const pipeline = [
    {
      '$lookup': {
        'from': 'ClientDocument',
        'localField': '_id',
        'foreignField': 'clientId',
        'as': 'documents'
      }
    },
    {
      '$lookup': {
        'from': 'UploadedFile',
        'localField': '_id',
        'foreignField': 'clientId',
        'as': 'uploadedFiles'
      }
    },
    {
      '$addFields': {
        'maxDocumentModifiedOn': { '$max': '$documents.modifiedOn' },
        'maxUploadedFileModifiedOn': { '$max': '$uploadedFiles.modifiedOn' }
      }
    },
    {
      '$addFields': {
        'maxModificationDate': {
          '$max': ['$modifiedOn', '$maxDocumentModifiedOn', '$maxUploadedFileModifiedOn']
        }
      }
    },
    {
      '$match': {
        'maxModificationDate': { '$lt': new Date(beforeDate) }
      }
    },
    {
      '$project': {
        '_id': 1,
        'maxModificationDate': 1,
        'firstName': 1,
        'lastName': 1,
        'gender': 1,
        'createdOn': 1,
        'clientTypeId': 1
      }
    }
  ]
  
  return this.collection
    .aggregate(pipeline)
    .toArray()
    .then(convertFromDatabase)
}

export default ClientRepository
