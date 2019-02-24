import {forEach} from 'lodash'
import {convertFromDatabase, createBaseRepository} from './MongoRepository'
import {ObjectId} from 'mongodb'
import { DocumentStatus } from '../../modules/client-documents/config';

const ClientDocumentRepository = createBaseRepository('ClientDocument')

ClientDocumentRepository.prototype.findByClientId = function (id) {
  const filters = {clientId: ObjectId(id)}
  return this.collection.find(filters)
    .toArray()
    .then(convertFromDatabase)
}

const getClientsFromAggregateResponse = results => {
  forEach(results, result => {
    if (result.client && result.client.length) {
      result.client = convertFromDatabase(result.client[0])
    } else {
      result.client = null
    }
  })
  return convertFromDatabase(results)
}

ClientDocumentRepository.prototype.getIncompleteDocumentListForUser = function (userId) {
  const match = {
    $match : { 
      ownerId : ObjectId(userId),
      isArchived: false,
      status: DocumentStatus.DRAFT
    }
  }
  const lookup = {
    $lookup: {
      from: 'ClientFile',
      localField: 'clientId',
      foreignField: '_id',
      as: 'client'
  }}
  return this.collection
    .aggregate([match, lookup])
    .toArray()
    .then(getClientsFromAggregateResponse)
}

export default ClientDocumentRepository
