import {createBaseRepository} from './MongoRepository'

const UploadedFileRepository = createBaseRepository('UploadedFile')

UploadedFileRepository.prototype.findUpdatedBefore = function (beforeDate) {
  const filters = {modifiedOn: { $lte: beforeDate }}
  return this.collection.find(filters)
    .then(this.convertFromDatabase)
}

export default UploadedFileRepository
