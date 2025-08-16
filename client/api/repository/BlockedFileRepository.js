import {forEach} from 'lodash'
import {convertFromDatabase, createBaseRepository} from './MongoRepository'
import {ObjectId} from 'mongodb'

const BlockedFileRepository = createBaseRepository('BlockedFile')

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

const findBlockedFileWithClient = (collection, userId) => {
  const match = {
    $match: {
      userId: ObjectId(userId)
    }
  }
  const lookup = {
    $lookup: {
      from: 'ClientFile',
      localField: 'clientId',
      foreignField: '_id',
      as: 'client'
  }}
  return collection
    .aggregate([match, lookup])
    .toArray()
}

BlockedFileRepository.prototype.findByUserId = function (userId) {
  return findBlockedFileWithClient(this.collection, userId)
    .then(getClientsFromAggregateResponse)
}

export default BlockedFileRepository
