import {forEach, concat} from 'lodash'
import {convertFromDatabase, createBaseRepository} from './MongoRepository'
import {ObjectId} from 'mongodb'

const ClientLinkRepository = createBaseRepository('ClientLink')

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

const findLinksForAttribute = (collection, idx, clientId) => {
  const matchAttr = idx === 1 ? 'clientId1' : 'clientId2'
  const lookAttr = idx === 1 ? 'clientId2' : 'clientId1'
  const match = {
    $match : { 
      [matchAttr]: ObjectId(clientId)
    }
  }
  const lookup = {
    $lookup: {
      from: 'ClientFile',
      localField: lookAttr,
      foreignField: '_id',
      as: 'client'
  }}
  return collection
    .aggregate([match, lookup])
    .toArray()
}

ClientLinkRepository.prototype.getLinksForClientId = function (clientId) {
  const promises = []
  promises.push(findLinksForAttribute(this.collection, 1, clientId))
  promises.push(findLinksForAttribute(this.collection, 2, clientId))

  return Promise.all(promises)
    .then(results => {
      const merged = concat(results[0], results[1])
      return getClientsFromAggregateResponse(merged)
    })
}

export default ClientLinkRepository
