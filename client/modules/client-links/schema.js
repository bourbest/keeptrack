import {Schema, validate, required} from 'sapin'
import {objectId} from '../common/validate'

export const clientLinkSchema = new Schema({
  id: objectId,
  clientId1: objectId(required),
  clientId2: objectId(required)
})

export default (entity, props) => {
  const errors = validate(entity, clientLinkSchema)
  return errors
}
