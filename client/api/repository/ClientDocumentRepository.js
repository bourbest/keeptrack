import {convertFromDatabase, createBaseRepository} from './MongoRepository'
import {ObjectId} from 'mongodb'

const ClientDocumentRepository = createBaseRepository('ClientDocument')

ClientDocumentRepository.prototype.findByClientId = function (id) {
  const filters = {clientId: ObjectId(id)}
  return this.collection.find(filters)
    .toArray()
    .then(convertFromDatabase)
}

export default ClientDocumentRepository
