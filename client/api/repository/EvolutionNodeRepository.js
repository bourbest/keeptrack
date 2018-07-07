import {convertFromDatabase, createBaseRepository} from './MongoRepository'
import {ObjectId} from 'mongodb'

const EvolutionNoteRepository = createBaseRepository('EvolutionNote')

EvolutionNoteRepository.prototype.findByClientId = function (id) {
  const filters = {clientId: ObjectId(id)}
  return this.collection.find(filters)
    .toArray()
    .then(convertFromDatabase)
}

export default EvolutionNoteRepository
