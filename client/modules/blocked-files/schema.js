import {Schema, validate, required} from 'sapin'
import {objectId} from '../common/validate'

export const blockedFileSchema = new Schema({
  id: objectId,
  userId: objectId(required),
  clientId: objectId(required)
})

export default (entity, props) => {
  const errors = validate(entity, blockedFileSchema)
  return errors
}
