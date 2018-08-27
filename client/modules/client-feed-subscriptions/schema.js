import { Schema, boolean, date, required, validate } from 'sapin'
import {objectId} from '../common/validate'
export const clientFeedSubscriptionSchema = new Schema({
  id: objectId,
  isArchived: boolean,
  clientId: objectId,
  userId: objectId,
  fromDate: date(required),
  createdOn: date,
  modifiedOn: date
})

export default (entity, props) => {
  const errors = validate(entity, clientFeedSubscriptionSchema)
  return errors
}
